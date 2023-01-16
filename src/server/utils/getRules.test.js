const {
  CommonConfig,
  OnesConfigList,
  VALID_COOKIE_TIME,
  COOKIE_LANG_PATH,
  EXPIRE_COOKIE_TIME
} = require("../const");
const { getAllRule } = require("./getRules");
const { getEnvInfoFromUrl } = require("./getValue");

const TEST_DATA = {
  ORIGINAL: {
    HOST: "dev.myones.net",
    URL: "https://dev.myones.net"
  },
  EN: {
    HOST: "en.dev.myones.net",
    URL: "https://en.dev.myones.net"
  },
  COMP: {
    HOST: "comp.dev.myones.net",
    URL: "https://comp.dev.myones.net"
  },
  ZH_COMP: {
    HOST: "zh.comp.dev.myones.net",
    URL: "https://zh.comp.dev.myones.net"
  }
};

function removeUnusedChar(str) {
  return str.replace(/\ +/g, "").replace(/[\r\n]/g, "");
}

function getLangRules(lang) {
  return `
  \`\`\`langCookie.json
  {"language":{"value":"${lang}","maxAge":0,"path":"/","domain":".dev.myones.net"}}
  \`\`\`

  \`\`\`tokenLangInfo.txt
  /"language":".+?"/ig: ""language":"${lang}""
  \`\`\`
  
  /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{langCookie.json} reqHeaders://accept-language=${lang}  resCookies://{langCookie.json} 
  
  /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenLangInfo.txt}


  \`\`\`cookie.js

      // 设置当前cookie
      var expireKV =  \`expires='${VALID_COOKIE_TIME}'\` ;
      var pathKV = \`path=${COOKIE_LANG_PATH}\`;
      
      
      // 清除当前cookie
      document.cookie = \`language=; expires='${EXPIRE_COOKIE_TIME}';\${pathKV};\`;
      
      document.cookie = \`language=${lang};\${pathKV};\`;
      
  \`\`\`
  
  * jsPrepend://{cookie.js} jsAppend://{cookie.js} includeFilter://resH:content-type=html
  
  `;
}

function getOnesConfigRules(env) {
  const info = OnesConfigList[env];
  return `
      \`\`\`onesConfig.js 
      window.onesConfig = Object.assign(
        ${JSON.stringify(CommonConfig)},
      (window.onesConfig||{}),
      ${JSON.stringify(info)}
      )
    \`\`\`

    * jsPrepend://{onesConfig.js} jsAppend://{onesConfig.js} includeFilter://resH:content-type=html

    \`\`\`tokenConfigInfo.txt
    /"ones:instance:operatingRegion":".+?"/ig: ""ones:instance:operatingRegion":"${
      info.operatingRegion
    }""
    /"ones:instance:serveMode":".+?"/ig: ""ones:instance:serveMode":"${
      info.serveMode
    }""
    \`\`\`

    /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenConfigInfo.txt}
  
  `;
}

function getBranchScriptRules(hostname = "") {
  let { lang, env } = getEnvInfoFromUrl(hostname);

  const branchName = `${lang}_${env}_api_branch`;

  return `
      \`\`\`apiBranch.js 

      const data = window.name
      let api_branch = ''

      try{
        const obj = JSON.parse(data) ||{};

        api_branch = obj.api_branch ;

        var domain = \`domain=.dev.myones.net\`;

        // 清除当前cookie
        document.cookie = \`${branchName}=; expires='${EXPIRE_COOKIE_TIME}';\`;

        document.cookie = \`${branchName}=\${api_branch}; \${domain}\`;

      }catch(e){
        console.log("api 指向失败",e)
      }

    \`\`\`

    * jsPrepend://{apiBranch.js} includeFilter://resH:content-type=html
  
  `;
}

function getBranchApiRules(api_branch) {
  return `
  
    \`\`\`branch.txt
    x-ones-api-branch-project:	/project/${api_branch}/
    x-ones-api-branch-wiki:	/project/${api_branch}/
    x-ones-api-branch-stripe:	/project/${api_branch}/
    \`\`\`

    /\\/\\/(.+?)\\..+\\/api\\//  reqHeaders://{branch.txt}
  `;
}

function getApiRedirectRule() {
  return `
    /(https?):\\/\\/((zh|ja|en)\\.)?((cn|com|cnp|comp)\\.)?(.+)/ $1://$6
  `;
}

function getApiCorsRule(currentOrigin) {
  return `
    \`\`\`accessResponseHeader.txt
    access-control-allow-origin:  ${currentOrigin}
    access-control-allow-credentials: true
    Access-Control-Allow-Methods: GET, POST, PUT, PATCH, POST, DELETE, OPTIONS
    \`\`\`
  
    
    \`\`\`accessRequestHeader.txt
    origin: https://dev.myones.net
    referer: https://dev.myones.net/
    \`\`\`
    
    * resHeaders://{accessResponseHeader.txt}  reqHeaders://{accessRequestHeader.txt} statusCode://200

    /\\/\\/(.+?)\\..+\\/api\\// includeFilter://m:options replaceStatus://200
  
  `;
}

describe("Test getAllRules", () => {
  test("Test No Data", () => {
    const result = getAllRule({
      headers: {
        referer: ""
      }
    });

    expect(result).toEqual(``);
  });

  test("Test No Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.ORIGINAL.HOST
      },
      originalReq: {
        url: TEST_DATA.ORIGINAL.URL
      }
    });

    expect(result).toEqual(``);
  });

  test("Test Lang Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.EN.HOST
      },
      originalReq: {
        url: TEST_DATA.EN.URL
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
          ${getLangRules("en")}

          ${getBranchScriptRules(TEST_DATA.EN.URL)}

          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.EN.URL)}
            
        `
      )
    );
  });

  test("Test Env Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.COMP.HOST
      },
      originalReq: {
        url: TEST_DATA.COMP.URL
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
          ${getOnesConfigRules("comp")}

          ${getBranchScriptRules(TEST_DATA.COMP.URL)}
          
          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.COMP.URL)}
        `
      )
    );
  });

  test("Test Env & Lang Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.ZH_COMP.HOST
      },
      originalReq: {
        url: TEST_DATA.ZH_COMP.URL
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
          ${getLangRules("zh")}

          ${getOnesConfigRules("comp")}

          ${getBranchScriptRules(TEST_DATA.ZH_COMP.URL)}
          
          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.ZH_COMP.URL)}

        `
      )
    );
  });

  test("Test Env & Lang & Branch Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.ZH_COMP.HOST,
        cookie: "zh_comp_api_branch=master"
      },
      originalReq: {
        url: TEST_DATA.ZH_COMP.URL
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
          ${getLangRules("zh")}

          ${getOnesConfigRules("comp")}
        
          ${getBranchScriptRules(TEST_DATA.ZH_COMP.URL)}

          ${getBranchApiRules("master")}

          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.ZH_COMP.URL)}
        
      `
      )
    );
  });

  test("Test All Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.ZH_COMP.HOST,
        cookie: "zh_comp_api_branch=master;"
      },
      originalReq: {
        url: TEST_DATA.ZH_COMP.URL
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
          ${getLangRules("zh")}

          ${getOnesConfigRules("comp")}

          ${getBranchScriptRules(TEST_DATA.ZH_COMP.URL)}

          ${getBranchApiRules("master")}
          
          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.ZH_COMP.URL)}

        `
      )
    );
  });
});
