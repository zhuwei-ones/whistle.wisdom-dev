import {
  COOKIE_LANG_PATH,
  EXPIRE_COOKIE_TIME,
  VALID_COOKIE_TIME
} from "../../const";
import { getOriginalHostname } from "../getValue";

export function getTimezoneApiRules(timezone: string, referer: string) {
  // const currentDomain = referer?.split("//")?.[1];

  /**
   * 接口 Response Header 只覆盖原cookie timezone ，不做有效cookie 设置，以 前端脚本设置的为主
   * 因为接口调用的域名没有环境标识，比如是dev.myones.net
   * 所以无法设置 子域名的 cookie，只能设置 .dev.myones.net ，导致多个环境可能会相互影响
   * 所以语言标识不应该在这里设置，以前端设置的脚本为主
   * 前端设置 cookie 的 domain 是 具体的domain 下的，比如 ja.comp.dev.myones.net，不会相互影响
   */
  const timezoneJson = {
    timezone: {
      value: timezone,
      maxAge: 0,
      // expires: EXPIRE_COOKIE_TIME,
      path: "/",
      domain: `.${getOriginalHostname(referer)}` //currentDomain ? `.${currentDomain}` : ""
    }
  };

  const apiRules = `
        \`\`\`timezoneCookie.json
        ${JSON.stringify(timezoneJson)}
        \`\`\`
        
        \`\`\`tokenTimezoneInfo.txt
          /"timezone":".+?"/ig: ""timezone":"${timezone}""
        \`\`\`
        
        /\\/\\/(.+?)\\..+\\/api\\// reqCookies://{timezoneCookie.json} resCookies://{timezoneCookie.json} 
        
        /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenTimezoneInfo.txt}
    `;

  return apiRules;
}

export function getTimezoneJsRules(timezone: string) {
  const timezoneJson = {
    timezone: {
      value: timezone,
      expires: VALID_COOKIE_TIME,
      path: COOKIE_LANG_PATH
    }
  };

  return `
      \`\`\`cookie.js
  
        // 设置当前cookie
        var expireKV =  \`expires='${timezoneJson.timezone.expires}'\` ;
        var pathKV = \`path=${timezoneJson.timezone.path}\`;
        
        // 清除当前cookie
        document.cookie = \`timezone=; expires='${EXPIRE_COOKIE_TIME}';\${pathKV};\`;
        
        document.cookie = \`timezone=${timezone};\${pathKV};\`;
        
      \`\`\`
      
      * jsPrepend://{cookie.js} jsAppend://{cookie.js} includeFilter://resH:content-type=html 
    `;
}

//【获取规则】语言匹配
export function getTimezoneRules(timezone: string, referer: string) {
  if (!timezone) {
    return "";
  }

  return `
      ${getTimezoneApiRules(timezone, referer)}
      ${getTimezoneJsRules(timezone)}
    `;
}
