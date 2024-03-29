import { IncomingMessage } from "http";
import { ConfigList, HOST_REG, URl_REG } from "../const";
import { LanguageList } from "../const";
import { ConfigEnv, LangEnv } from "../types/env";

// regExp 使用exec 会有缓存，每次执行都会在上一次执行结果基础上
export const getEnvHostnameReg = () => {
  return `((${LanguageList.join("|")})\\.)?((${ConfigList.join("|")})\\.)?(.+)`;
};

// 获取匹配拼接了 env+config的域名的正则
export function getEnvUrlReg() {
  return `(https?):\\/\\/${getEnvHostnameReg()}`;
}

export function getUrlMatchResult(hostname: string) {
  const result = new RegExp(`://${getEnvHostnameReg()}$`, "g").exec(hostname);

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
      env: ""
    };
  }

  const result = getUrlMatchResult(hostname);

  const lang = result?.[2] as LangEnv;
  const env = result?.[4] as ConfigEnv;

  return {
    lang: lang && LanguageList.includes(lang) ? lang : "",
    env: env && ConfigList.includes(env) ? env : ""
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

// 获取 api 接口原本的路径（过滤前面自定义添加的域名，比如 zh.com.xxx.xx/a/a，变成 xxx.xx/a/a)
export function getApiCurrentPath(url: string) {
  if (!url) {
    return "";
  }

  const regRule = getEnvUrlReg();
  const reg = new RegExp(regRule, "g");
  const result = reg.exec(url);

  if (!result) {
    return "";
  }

  return `${result[1]}://${result[6]}`;
}

// 获取请求正确的来源地址（请求发生时的页面链接）
export function getCorrectUrlEntry(req: WhistleBase.Request): string {
  const referer = req.headers.referer;
  const originUrl = HOST_REG.exec(req?.originalReq?.url)?.[0];

  if (!URl_REG.test(referer)) {
    return originUrl;
  }

  // 总的来说，我需要拿到标识
  // 判断 referer 和 url 标识，有 标识优先取 url，url 没有取 referer
  // 是否存在有一种情况，url 没有标识，但是 referer 又是上一个页面链接，这种情况暂时想不到
  const refererEnvInfo = getEnvInfoFromUrl(referer);
  const urlEnvInfo = getEnvInfoFromUrl(originUrl);

  if (urlEnvInfo.env || urlEnvInfo.lang) {
    return originUrl;
  }

  if (refererEnvInfo.env || refererEnvInfo.lang) {
    return referer;
  }

  /**
   * 调用接口跟当前链接不是同一个域名
   * host: previewglobal-us.myones.net
   * referer: https://en.comp.previewglobal.myones.net/
   * url: https://previewglobal-us.myones.net/project/api/project/auth/token_info
   */

  /**
   * 跳转环境之后，referer 是上一个页面，
   * host: en.comp.previewglobal.myones.net
   * referer https://previewglobal.myones.net/
   * url: https://en.comp.previewglobal.myones.net/project/
   */

  /**
   * referer 不一定表示当前访问页面链接，而是表示上一个页面的链接，所以这里不能全部使用referer
   */

  return referer;
}

export function getCorrectEnvBranchName(req: IncomingMessage) {
  const currentUrl = getCorrectUrlEntry(req);
  const { lang, env } = getEnvInfoFromUrl(currentUrl);

  const branchName = `${lang}_${env}_api_branch`;

  return branchName;
}
