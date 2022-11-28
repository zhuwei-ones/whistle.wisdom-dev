import { getApiBranchEnvRules } from "./getApiEnvRules";
import { getLangRules } from "./getLangRule";
import { getOnesConfigRules } from "./getOnesConfig";
import { getOtherRules } from "./getOtherRules";

import {
  getEnvUrlReg,
  getEnvInfoFromUrl,
  getCorrectUrlEntry
} from "../getValue";

//【获取规则】api 接口导去正确域名（过滤前面自定义添加的域名，比如 zh.com.xxx.xx)
export function getApiToCurrectHostRules() {
  return `/${getEnvUrlReg()}/ $1://$6`;
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

  const resultRole = `
        ${getLangRules(lang, req.headers.origin)}
        ${getOnesConfigRules(env)}
        ${getApiBranchEnvRules(req)}
        ${getApiToCurrectHostRules()} 
        ${getOtherRules(req)}
      `;

  console.log(
    "\n\n匹配信息--->",
    "host--->",
    req.headers.host,
    "rules--->"
    // resultRole
  );
  return resultRole;
}
