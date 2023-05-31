import { getApiBranchRules } from "./getApiEnvRules";
import { getLangRules } from "./getLangRule";
import { getOnesConfigRules } from "./getOnesConfig";
import { getEnvInfoFromUrl, getCorrectUrlEntry } from "../getValue";
import { getApiCommonRules } from "./getApiCommonRules";
import { getTimezoneRules } from "./getTimezoneRules";

// 统一获取所有规则入口
export function getAllRule(req: WhistleBase.Request) {
  const currentUrl = getCorrectUrlEntry(req);
  const envInfo = getEnvInfoFromUrl(currentUrl);
  const { lang, env, timezone } = envInfo;

  console.log("envInfo--->", envInfo, "currentUrl-->", currentUrl);

  /**
   * 如果没有环境信息和 语言配置，没有必要代理
   */
  if (!env && !lang && !timezone) {
    return ``;
  }

  const resultRole = `
    ${getLangRules(lang, currentUrl)}
    ${getOnesConfigRules(env)}
    ${getApiBranchRules(req)}
    ${getApiCommonRules(req)}
    ${getTimezoneRules(timezone, currentUrl)}
  `;

  // console.log(
  //   "\n\n匹配信息--->",
  //   "host--->",
  //   req.headers.host,
  //   "rules--->"
  //   // resultRole
  // );
  return resultRole;
}
