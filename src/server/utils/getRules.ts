import { IncomingMessage } from "http";
import { CommonConfig, OnesConfigList } from "../const";
import { ConfigEnv, LangEnv } from "../types/env";
import {
  getApiCurrentPath,
  getEnvUrlReg,
  getEnvInfoFromUrl,
  getCorrectUrlEntry
} from "./getValue";

//【获取规则】api 接口导去正确域名（过滤前面自定义添加的域名，比如 zh.com.xxx.xx)
export function getApiToCurrectHostRules() {
  return `${getEnvUrlReg()} $1://$6`;
}

//【获取规则】语言匹配
export function getLangRules(lang: LangEnv, referer: string) {
  if (!lang) {
    return "";
  }

  const langJson = {
    language: {
      value: lang,
      maxAge: 600000000,
      path: "/",
      domain: referer?.split("//")?.[1] || ""
    }
  };

  const apiRules = `
  
        \`\`\`langJson.json
        ${JSON.stringify(langJson)}
        \`\`\`
  
        \`\`\`lang.txt
          /\"language\"\:\".+?\"/ig: ""language":"${lang}""
        \`\`\`
  
        \/\\/\\/(.+?)\\..+\\/api\\/\/ reqCookies://{langJson.json} reqHeaders://accept-language=${lang}  resCookies://{langJson.json} 
  
        \/\\/\\/(.+?)\\.(.+)\\/token_info\/  resReplace://{lang.txt}
  
    `;

  const jsRules = `
  
  
      \`\`\`cookie.js
  
        // 清除当前cookie
        document.cookie = \`language=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;
        
        // 设置当前cookie
        const expireKV =  \`expires=${langJson.language.maxAge}\` ;
        const pathKV = \`path=${langJson.language.path}\`;
      
        document.cookie = \`language=${lang};\${expireKV};\${pathKV};\`;
      
      \`\`\`
  
      * jsPrepend://{cookie.js} includeFilter://resH:content-type=html
    `;

  return `
      ${apiRules}
      ${jsRules}
    `;
}

//【获取规则】onesConfig 匹配
export function getConfigRules(config: ConfigEnv) {
  if (!config) {
    return "";
  }

  const onesConfigVal = OnesConfigList[config];
  const onesConfigStr = JSON.stringify(onesConfigVal);
  const commonOnesConfig = JSON.stringify(CommonConfig);

  const tokenInfoRuleResult = `
  
      \`\`\`tokenInfoRule.txt
        /\"ones:instance:operatingRegion\"\:\".+?\"/ig: ""ones:instance:operatingRegion":"${onesConfigVal.operatingRegion}""
        /\"ones:instance:serveMode\"\:\".+?\"/ig: ""ones:instance:serveMode":"${onesConfigVal.serveMode}""
      \`\`\`
  
      /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenInfoRule.txt} 
  
    `;

  const onesConfigRule = `
    
      \`\`\`onesConfig.js 
        window.onesConfig = Object.assign(
          (window.onesConfig||{}),
          ${commonOnesConfig},
          ${onesConfigStr}
        )
      \`\`\`
  
      * jsPrepend://{onesConfig.js} includeFilter://resH:content-type=html
    
    `;

  return `
      ${onesConfigRule}
      ${tokenInfoRuleResult}
    `;
}

//【获取规则】其他规则，比如解决跨域，referer
export function getOtherRules(req: IncomingMessage) {
  const currentHost = req.headers.origin; // 当前访问的页面的host，比如 ja.myones.net
  const originHost = `${getApiCurrentPath(currentHost)}`; // 原本的host ,比如 myones.net

  if (req.url.indexOf("check_user_guide") > -1) {
    console.log(
      "originHost---->",
      originHost,
      "req.headers.referer--->",
      req.headers.referer
    );
  }

  if (!currentHost) {
    return ``;
  }

  return `
  
        \`\`\`resHeader.txt
        access-control-allow-origin: ${currentHost} 
        \`\`\`
  
        \`\`\`reqHeader.txt
        origin: ${originHost}
        referer: ${originHost}/
        \`\`\`
  
        * resHeaders://{resHeader.txt}  reqHeaders://{reqHeader.txt}
    
    `;
}

// 统一获取所有规则入口
export function getAllRule(req: WhistleBase.Request) {
  const currentUrl = getCorrectUrlEntry(req);
  const envInfo = getEnvInfoFromUrl(currentUrl);
  const { lang, env } = envInfo;

  console.log("envInfo--->", envInfo, "currentUrl-->", currentUrl);

  if (!env && !lang) {
    return ``;
  }

  // console.log("isAllowHost-->", currentUrl, envInfo);

  const resultRole = `
      ${getLangRules(lang, req.headers.origin)}
      ${getConfigRules(env)}
      ${getApiToCurrectHostRules()} 
      ${getOtherRules(req)}
    `;

  return resultRole;
}
