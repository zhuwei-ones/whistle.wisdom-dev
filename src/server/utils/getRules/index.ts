import { getApiBranchRules } from "./getApiEnvRules";
import { getLangRules } from "./getLangRule";
import { getOnesConfigRules } from "./getOnesConfig";
import { getEnvInfoFromUrl, getCorrectUrlEntry } from "../getValue";
import { getApiCommonRules } from "./getApiCommonRules";

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
    ${getApiBranchRules(req)}
    ${getApiCommonRules(req)}
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
