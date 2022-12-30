import {
  COOKIE_LANG_PATH,
  EXPIRE_COOKIE_TIME,
  VALID_COOKIE_TIME
} from "../../const";
import { LangEnv } from "./../../types/env.d";

export function getLangApiRules(lang: LangEnv, referer: string) {
  const langJson = {
    language: {
      value: lang,
      maxAge: 600000000,
      expires: VALID_COOKIE_TIME,
      path: COOKIE_LANG_PATH,
      domain: referer?.split("//")?.[1] || ""
    }
  };

  const apiRules = `
      \`\`\`langCookie.json
      ${JSON.stringify(langJson)}
      \`\`\`
      
      \`\`\`tokenLangInfo.txt
        /"language":".+?"/ig: ""language":"${lang}""
      \`\`\`
      
      /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{langCookie.json} reqHeaders://accept-language=${lang} resCookies://{langCookie.json} 
      
      /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenLangInfo.txt}
  `;

  return apiRules;
}

export function getLangJsRules(lang: LangEnv) {
  const langJson = {
    language: {
      value: lang,
      expires: VALID_COOKIE_TIME,
      path: COOKIE_LANG_PATH
    }
  };

  return `
    \`\`\`cookie.js

      // 设置当前cookie
      var expireKV =  \`expires='${langJson.language.expires}'\` ;
      var pathKV = \`path=${langJson.language.path}\`;
      
      // 清除当前cookie
      document.cookie = \`language=; expires='${EXPIRE_COOKIE_TIME}';\${pathKV};\`;
      
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
