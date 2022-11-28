import { ConfigList, URl_REG } from "../const";
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
  const host = req.headers.host;
  const originUrl = /^https?:\/\/[\w-.]+(:\d+)?/i.exec(
    req?.originalReq?.url
  )?.[0];

  if (!URl_REG.test(referer)) {
    return originUrl;
  }

  if (host && originUrl?.includes(host)) {
    return originUrl;
  }

  /**
   * referer 不一定表示当前访问页面链接，而是表示上一个页面的链接，所以这里不能全部使用referer
   */

  return referer;
}
