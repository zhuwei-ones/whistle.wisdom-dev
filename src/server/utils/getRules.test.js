const { CommonConfig, OnesConfigList } = require("../const");
const { getAllRule } = require("./getRules");

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
  \`\`\`langJson.json
  {"language":{"value":"${lang}","maxAge":600000000,"expires": "3000-01-04T04:17:38.081Z","path":"/","domain":""}}
  \`\`\`

  \`\`\`lang.txt
  /"language":".+?"/ig: ""language":"${lang}""
  \`\`\`
  
  /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{langJson.json} reqHeaders://accept-language=${lang}  resCookies://{langJson.json} 
  
  /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{lang.txt}


  \`\`\`cookie.js
      
      // 清除当前cookie
      document.cookie = \`language=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;
      
      // 设置当前cookie
      var expireKV =  \`expires='3000-01-04T04:17:38.081Z'\` ;
      var pathKV = \`path=/\`;
      
      document.cookie = \`language=${lang};\${expireKV};\${pathKV};\`;
      
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

    \`\`\`tokenInfoRule.txt
    /"ones:instance:operatingRegion":".+?"/ig: ""ones:instance:operatingRegion":"${
      info.operatingRegion
    }""
    /"ones:instance:serveMode":".+?"/ig: ""ones:instance:serveMode":"${
      info.serveMode
    }""
    \`\`\`

    /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenInfoRule.txt}
  
  `;
}

function getBranchScriptRules(api_branch) {
  return `
      \`\`\`apiBranch.js 

      const data = window.name
      let api_branch = ''

      try{
        const obj = JSON.parse(data) ||{};

        api_branch = obj.api_branch ;

        // 清除当前cookie
        document.cookie = \`api_branch=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;

        document.cookie = \`api_branch=\${api_branch};\`;

      }catch(e){}

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
    \`\`\`resHeader.txt
    access-control-allow-origin: https://${currentOrigin}
    \`\`\`
    
    \`\`\`reqHeader.txt
    origin: https://dev.myones.net
    referer: https://dev.myones.net/
    \`\`\`
    
    * resHeaders://{resHeader.txt}  reqHeaders://{reqHeader.txt}
  
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

          ${getBranchScriptRules()}

          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.EN.HOST)}
            
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

          ${getBranchScriptRules()}
          
          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.COMP.HOST)}
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

          ${getBranchScriptRules()}
          
          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.ZH_COMP.HOST)}

        `
      )
    );
  });

  test("Test Env & Lang & Branch Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.ZH_COMP.HOST,
        cookie: "api_branch=master"
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
        
          ${getBranchScriptRules()}

          ${getBranchApiRules("master")}

          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.ZH_COMP.HOST)}
        
      `
      )
    );
  });

  test("Test All Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: TEST_DATA.ZH_COMP.HOST,
        cookie: "api_branch=master;"
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

          ${getBranchScriptRules()}

          ${getBranchApiRules("master")}
          
          ${getApiRedirectRule()}

          ${getApiCorsRule(TEST_DATA.ZH_COMP.HOST)}

        `
      )
    );
  });
});
