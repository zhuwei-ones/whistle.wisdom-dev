import { EnvList, LanguageList, PageAllowHost } from "../const";
import { LangRules, OnesConfigRules, TokenInfoEnvRules } from "../rules";
export function getLangFromUrl(hostname: string) {}

export function getEnvFromUrl(hostname: string) {}

export function getEnvInfoFromUrl(hostname: string): {
  lang: typeof LanguageList[number] | "";
  env: typeof EnvList[number] | "";
} {
  if (!hostname) {
    return {
      lang: "",
      env: "",
    };
  }

  const reg = /(.+?)\.(.+?)\..+/g;

  const result = reg.exec(hostname);

  const lang = (result?.[1] as typeof LanguageList[number]) || "";
  const env = (result?.[2] as typeof EnvList[number]) || "";

  return {
    lang,
    env,
  };
}

// 获取原本的hostname，而不是经过我拼接了 en.com 这一类的
export function getOriginalHostname() {}

export function getFinalRule(reqHost: string) {
  const envInfo = getEnvInfoFromUrl(reqHost);

  const { lang, env } = envInfo;

  const langRule = lang && LangRules[lang];
  const tokenInfoRule = env && TokenInfoEnvRules[env];

  let langRuleResult = ``;
  let tokenInfoRuleResult = ``;
  const onesConfigRuleResult = OnesConfigRules;

  console.log("isAllowHost-->", reqHost);

  if (langRule) {
    const langJson = langRule?.json || {};

    langRuleResult = `

        \`\`\`langJson.json
        ${JSON.stringify(langJson)}
        \`\`\`

        \`\`\`lang.txt
        ${langRule.rule}
        \`\`\`

        \/\\/\\/(.+?)\\..+\\/api\\/\/ reqCookies://{langJson.json} reqHeaders://accept-language=${lang} resReplace://{lang.txt} resCookies://{langJson.json} 

    `;
  }

  if (tokenInfoRule) {
    tokenInfoRuleResult = `

        \`\`\`tokenInfoRule.txt
        ${tokenInfoRule}
        \`\`\`

        \/\\/\\/(.+?)\\.(.+)\\/token_info\/  resReplace://{tokenInfoRule.txt} 
    
    `;
  }

  const resultRole = `

    ${onesConfigRuleResult}

    ${langRuleResult}

    ${tokenInfoRuleResult}
  
  `;

  return resultRole;
}
