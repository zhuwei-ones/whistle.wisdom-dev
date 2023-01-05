import {
  COOKIE_LANG_PATH,
  EXPIRE_COOKIE_TIME,
  VALID_COOKIE_TIME
} from "../../const";
import { getOriginalHostname } from "../getValue";
import { LangEnv } from "./../../types/env.d";

export function getLangApiRules(lang: LangEnv, referer: string) {
  // const currentDomain = referer?.split("//")?.[1];

  /**
   * 接口 Response Header 只覆盖原cookie language，不做有效cookie 设置，以 前端脚本设置的为主
   * 因为接口调用的域名没有环境标识，比如是dev.myones.net
   * 所以无法设置 子域名的 cookie，只能设置 .dev.myones.net ，导致多个环境可能会相互影响
   * 所以语言标识不应该在这里设置，以前端设置的脚本为主
   * 前端设置 cookie 的 domain 是 具体的domain 下的，比如 ja.comp.dev.myones.net，不会相互影响
   */
  const langJson = {
    language: {
      value: lang,
      maxAge: 0,
      // expires: EXPIRE_COOKIE_TIME,
      path: "/",
      domain: `.${getOriginalHostname(referer)}` //currentDomain ? `.${currentDomain}` : ""
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
      
      document.cookie = \`language=${lang};\${pathKV};\`;
      
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
