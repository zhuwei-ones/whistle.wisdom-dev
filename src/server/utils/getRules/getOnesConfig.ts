import { CommonConfig } from "./../../const/index";
import { OnesConfigList } from "../../const";
import { ConfigEnv } from "../../types/env";

//【获取规则】语言匹配 - js 脚本
export function getOnesConfigJsRules(config: Exclude<ConfigEnv, "">) {
  const onesConfigVal = OnesConfigList[config];
  const onesConfigStr = JSON.stringify(onesConfigVal);
  const commonOnesConfig = JSON.stringify(CommonConfig);
  const onesConfigRule = `
    \`\`\`onesConfig.js 
      window.onesConfig = Object.assign(
        ${commonOnesConfig},
        (window.onesConfig||{}),
        ${onesConfigStr}
      )
    \`\`\`
    
    * jsPrepend://{onesConfig.js} jsAppend://{onesConfig.js} includeFilter://resH:content-type=html
  `;

  return onesConfigRule;
}

//【获取规则】语言匹配 - 接口
export function getOnesConfigApiRules(config: Exclude<ConfigEnv, "">) {
  const onesConfigVal = OnesConfigList[config];
  const tokenInfoRuleResult = `
    \`\`\`tokenInfoRule.txt
      /"ones:instance:operatingRegion":".+?"/ig: ""ones:instance:operatingRegion":"${onesConfigVal.operatingRegion}""
      /"ones:instance:serveMode":".+?"/ig: ""ones:instance:serveMode":"${onesConfigVal.serveMode}""
    \`\`\`
    
    /\\/\\/(.+?)\\.(.+)\\/token_info/  resReplace://{tokenInfoRule.txt} 
  `;

  return tokenInfoRuleResult;
}

//【获取规则】onesConfig 匹配
export function getOnesConfigRules(config: ConfigEnv) {
  if (!config) {
    return "";
  }

  return `
    ${getOnesConfigJsRules(config)}
    ${getOnesConfigApiRules(config)}
  `;
}
