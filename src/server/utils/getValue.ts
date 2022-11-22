import { ConfigList } from "./../const";
import { CommonConfig, LanguageList, OnesConfigList } from "../const";
import { ConfigEnv, LangEnv } from "../types/env";

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

  const reg = /(.+?)\.(.+?)\..+/g;

  const result = reg.exec(hostname);

  const lang = result?.[1] as LangEnv;
  const env = result?.[2] as ConfigEnv;

  return {
    lang: lang && LanguageList.includes(lang) ? lang : "",
    env: env && ConfigList.includes(env) ? env : "",
  };
}

// 获取语言匹配的规则
export function getLangRules(lang: LangEnv) {
  if (!lang) {
    return "";
  }

  const langJson = {
    value: lang,
    maxAge: 600000000,
    path: "/",
  };

  return `

      \`\`\`langJson.json
      ${JSON.stringify(langJson)}
      \`\`\`

      \`\`\`lang.txt
        /\"language\"\:\".+?\"/ig: ""language":"${lang}""
      \`\`\`

      \/\\/\\/(.+?)\\..+\\/api\\/\/ reqCookies://{langJson.json} reqHeaders://accept-language=${lang} resReplace://{lang.txt} resCookies://{langJson.json} 

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
        ${commonOnesConfig}
        ${onesConfigStr}
      )
    \`\`\`

    \/myones.net\\/project\\/$\/  jsPrepend://{onesConfig.js}  includeFilter://resH:content-type=html
  
  `;

  return `

    ${onesConfigRule}

    ${tokenInfoRuleResult}
  
  `;
}

// 获取原本的hostname，而不是经过我拼接了 en.com 这一类的
export function getOriginalHostname() {}

// 获取 api 接口导去正确域名的规则（过滤前面自定义添加的域名，比如 zh.com.xxx.xx)
export function getApiToCurrectHost() {}

// 获取所有规则
export function getAllRule(reqHost: string) {
  const envInfo = getEnvInfoFromUrl(reqHost);
  const { lang, env } = envInfo;

  console.log("isAllowHost-->", reqHost);

  const resultRole = `
    ${getLangRules(lang)}
    ${getConfigRules(env)}
  `;

  return resultRole;
}
