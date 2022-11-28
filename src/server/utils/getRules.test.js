const { CommonConfig, OnesConfigList } = require("../const");
const { getAllRule } = require("./getRules");

function removeUnusedChar(str) {
  return str.replace(/\ +/g, "").replace(/[\r\n]/g, "");
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
        host: "dev.myones.net"
      },
      originalReq: {
        url: "https://dev.myones.net"
      }
    });

    expect(result).toEqual(``);
  });

  test("Test Lang Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: "en.dev.myones.net"
      },
      originalReq: {
        url: "https://en.dev.myones.net"
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
        \`\`\`langJson.json
        {"language":{"value":"en","maxAge":600000000,"path":"/","domain":""}}
        \`\`\`

        \`\`\`lang.txt
        /"language":".+?"/ig: ""language":"en""
        \`\`\`
        
        /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{langJson.json} reqHeaders://accept-language=en  resCookies://{langJson.json} 
        
        /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{lang.txt}

    
        \`\`\`cookie.js
            
            // 清除当前cookie
            document.cookie = \`language=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;
            
            // 设置当前cookie
            const expireKV =  \`expires=600000000\` ;
            const pathKV = \`path=/\`;
            
            document.cookie = \`language=en;\${expireKV};\${pathKV};\`;
            
        \`\`\`
        
        * jsPrepend://{cookie.js} includeFilter://resH:content-type=html
        
        /(https?):\\/\\/((zh|ja|en)\\.)?((cn|com|cnp|comp)\\.)?(.+)/ $1://$6
    `
      )
    );
  });

  test("Test Env Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: "comp.dev.myones.net"
      },
      originalReq: {
        url: "https://comp.dev.myones.net"
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `
        \`\`\`onesConfig.js 
        window.onesConfig = Object.assign(
          (window.onesConfig||{}),
          ${JSON.stringify(CommonConfig)},
          ${JSON.stringify(OnesConfigList.comp)}
        )
      \`\`\`
      
      * jsPrepend://{onesConfig.js} includeFilter://resH:content-type=html
    
      \`\`\`tokenInfoRule.txt
      /"ones:instance:operatingRegion":".+?"/ig: ""ones:instance:operatingRegion":"com""
      /"ones:instance:serveMode":".+?"/ig: ""ones:instance:serveMode":"standalone""
    \`\`\`
    
    /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenInfoRule.txt} 

    /(https?):\\/\\/((zh|ja|en)\\.)?((cn|com|cnp|comp)\\.)?(.+)/ $1://$6
    `
      )
    );
  });

  test("Test Env & Lang Rule", () => {
    const result = getAllRule({
      headers: {
        referer: "",
        host: "zh.comp.dev.myones.net"
      },
      originalReq: {
        url: "https://zh.comp.dev.myones.net"
      }
    });

    expect(removeUnusedChar(result)).toEqual(
      removeUnusedChar(
        `

        \`\`\`langJson.json
        {"language":{"value":"zh","maxAge":600000000,"path":"/","domain":""}}
        \`\`\`

        \`\`\`lang.txt
        /"language":".+?"/ig: ""language":"zh""
        \`\`\`
        
        /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{langJson.json} reqHeaders://accept-language=zh  resCookies://{langJson.json} 
        
        /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{lang.txt}

    
        \`\`\`cookie.js
            
            // 清除当前cookie
            document.cookie = \`language=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;
            
            // 设置当前cookie
            const expireKV =  \`expires=600000000\` ;
            const pathKV = \`path=/\`;
            
            document.cookie = \`language=zh;\${expireKV};\${pathKV};\`;
            
        \`\`\`
        
        * jsPrepend://{cookie.js} includeFilter://resH:content-type=html

        \`\`\`onesConfig.js 
            window.onesConfig = Object.assign(
            (window.onesConfig||{}),
            ${JSON.stringify(CommonConfig)},
            ${JSON.stringify(OnesConfigList.comp)}
            )
        \`\`\`
        
        * jsPrepend://{onesConfig.js} includeFilter://resH:content-type=html
        
        \`\`\`tokenInfoRule.txt
        /"ones:instance:operatingRegion":".+?"/ig: ""ones:instance:operatingRegion":"com""
        /"ones:instance:serveMode":".+?"/ig: ""ones:instance:serveMode":"standalone""
        \`\`\`
        
        /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenInfoRule.txt} 
        
        /(https?):\\/\\/((zh|ja|en)\\.)?((cn|com|cnp|comp)\\.)?(.+)/ $1://$6
    `
      )
    );
  });
});
