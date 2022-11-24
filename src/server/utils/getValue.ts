import { IncomingMessage } from "http";
import { ConfigList } from "./../const";
import { CommonConfig, LanguageList, OnesConfigList } from "../const";
import { ConfigEnv, LangEnv } from "../types/env";

// regExp 使用exec 会有缓存，每次执行都会在上一次执行结果基础上
const getEnvUrlReg = () => {
  return `((${LanguageList.join("|")})\\.)?((${ConfigList.join("|")})\\.)?(.+)`;
};

export function getUrlMatchResult(hostname: string) {
  const result = new RegExp(`://${getEnvUrlReg()}$`, "g").exec(hostname);

  return result;
}

// 从 请求中 获取到 配置的环境信息（语言/地域/公有私有）
export function getEnvInfoFromUrl(hostname: string): {
  lang: LangEnv;
  env: ConfigEnv;
} {
  if (!hostname) {
    return {
      lang: "",
      env: "",
    };
  }

  const result = getUrlMatchResult(hostname);

  const lang = result?.[2] as LangEnv;
  const env = result?.[4] as ConfigEnv;

  return {
    lang: lang && LanguageList.includes(lang) ? lang : "",
    env: env && ConfigList.includes(env) ? env : "",
  };
}

// 获取原本的hostname，而不是经过我拼接了 en.com 这一类的
export function getOriginalHostname(hostname: string) {
  if (!hostname) {
    return "";
  }

  const result = getUrlMatchResult(hostname);

  return result?.[5] || "";
}

// 获取 api 接口导去正确域名的规则（过滤前面自定义添加的域名，比如 zh.com.xxx.xx)
export function getApiToCurrectHostRules() {
  return `\/(https?):\\/\\/${getEnvUrlReg()}\/ $1:\/\/$6`;
}

// 获取 api 接口原本的路径（过滤前面自定义添加的域名，比如 zh.com.xxx.xx/a/a，变成 xxx.xx/a/a)
export function getApiCurrentPath(url: string) {
  if (!url) {
    return "";
  }

  const regRule = getApiToCurrectHostRules().split(" ")?.[0]?.slice(1, -1);

  const reg = new RegExp(regRule, "g");
  const result = reg.exec(url);

  if (!result) {
    return "";
  }

  return `${result[1]}://${result[6]}`;
}

// 获取语言匹配的规则
export function getLangRules(lang: LangEnv, referer: string) {
  if (!lang) {
    return "";
  }

  const langJson = {
    language: {
      value: lang,
      maxAge: 600000000,
      path: "/",
      domain: referer?.split("//")?.[1] || "",
    },
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
      document.cookie = \`language=; expires='Mon, 26 Jul 1997 05:00:00 GMT';}\`;
      
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

// 获取onesConfig 匹配的规则
export function getConfigRules(config: ConfigEnv) {
  if (!config) {
    return "";
  }

  const onesConfigVal = OnesConfigList[config];
  const onesConfigStr = JSON.stringify(onesConfigVal);
  const commonOnesConfig = JSON.stringify(CommonConfig);

  const tokenInfoRuleResult = `

    \`\`\`tokenInfoRule.txt
      /\"ones\:instance:operatingRegion\"\:\".+?\"/ig: ""ones:instance:operatingRegion":"${onesConfigVal.operatingRegion}""
      /\"ones\:instance:serveMode\"\:\".+?\"/ig: ""ones:instance:serveMode":"${onesConfigVal.serveMode}""
    \`\`\`

    \/\\/\\/(.+?)\\.(.+)\\/token_info\/  resReplace://{tokenInfoRule.txt} 

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

// 获取其他规则，比如解决跨域，referer
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

// 获取所有规则
export function getAllRule(req: WhistleBase.Request) {
  const referer =
    req.headers.referer ||
    /^https?:\/\/[\w-.]+(:\d+)?/i.exec(req?.originalReq?.url)?.[0];
  const envInfo = getEnvInfoFromUrl(referer);
  const { lang, env } = envInfo;

  // console.log("isAllowHost-->", referer, envInfo);
  ``;

  const resultRole = `
    ${getLangRules(lang, req.headers.origin)}
    ${getConfigRules(env)}
    ${getApiToCurrectHostRules()} 
    ${getOtherRules(req)}
  `;

  return resultRole;
}
