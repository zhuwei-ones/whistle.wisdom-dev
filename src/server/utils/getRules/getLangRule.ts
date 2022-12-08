import { LangEnv } from "./../../types/env.d";

export function getLangApiRules(lang: LangEnv, referer: string) {
  const langJson = {
    language: {
      value: lang,
      maxAge: 600000000,
      expires: `3000-01-04T04:17:38.081Z`,
      path: "/",
      domain: referer?.split("//")?.[1] || ""
    }
  };

  const apiRules = `
      \`\`\`langJson.json
      ${JSON.stringify(langJson)}
      \`\`\`
      
      \`\`\`lang.txt
        /"language":".+?"/ig: ""language":"${lang}""
      \`\`\`
      
      /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{langJson.json} reqHeaders://accept-language=${lang}  resCookies://{langJson.json} 
      
      /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{lang.txt}
  `;

  return apiRules;
}

export function getLangJsRules(lang: LangEnv) {
  const langJson = {
    language: {
      value: lang,
      maxAge: `3000-01-04T04:17:38.081Z`,
      path: "/"
    }
  };

  return `
    \`\`\`cookie.js
      
      // 清除当前cookie
      document.cookie = \`language=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;
      
      // 设置当前cookie
      var expireKV =  \`expires='${langJson.language.maxAge}'\` ;
      var pathKV = \`path=${langJson.language.path}\`;
      
      document.cookie = \`language=${lang};\${expireKV};\${pathKV};\`;
      
    \`\`\`
    
    * jsPrepend://{cookie.js} jsAppend://{cookie.js} includeFilter://resH:content-type=html 
  `;
}

//【获取规则】语言匹配
export function getLangRules(lang: LangEnv, referer: string) {
  if (!lang) {
    return "";
  }

  return `
    ${getLangApiRules(lang, referer)}
    ${getLangJsRules(lang)}
  `;
}
