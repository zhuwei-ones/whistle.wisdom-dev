import { CloudTypeList } from "../const";
import { PanelConfigList, FormKeys, DataKeys, DefaultValue } from "const/index";
import { getCookie } from "lib/index";

// 从配置信息中翻译出来中文
export function getValueFromConfigInfo(config) {
  const envName = Object.keys(config)
    .map((key) => {
      const item = PanelConfigList.filter((item) => item.key === key)?.[0];

      const value = config[key];

      const currentName = item.options.filter(
        (item) => item.value === value
      )?.[0]?.label;

      return currentName;
    })
    .filter((i) => i);

  return envName.length > 0 ? `当前环境：${envName.join("-")}` : "智慧开发";
}

export function getCloudType() {
  const cloudType = FormKeys["cloud"];
  const currentVal = onesConfig[DataKeys[cloudType]];

  return CloudTypeList.some((c) => currentVal === c.value)
    ? currentVal
    : DefaultValue[cloudType];
}

export function getOperationOrigin() {
  const origin = FormKeys["origin"];

  return onesConfig[DataKeys[origin]];
}

export function getLanguage() {
  const lang = FormKeys["lang"];

  return getCookie(DataKeys[lang]);
}

export function getApiBranch() {
  return getCookie("api_branch");
}

/**
 * 1、从 cookie 中获取 语言
 * 2、从 onesConfig 中 获取 origin 和 cloudType
 */
export function getEnvInfoFormConfig() {
  const data = {};

  if (typeof window?.onesConfig !== "object") {
    return "";
  }

  const cloudType = FormKeys["cloud"];
  const origin = FormKeys["origin"];
  const lang = FormKeys["lang"];

  data[cloudType] = getCloudType();
  data[origin] = getOperationOrigin();
  data[lang] = getLanguage();

  console.log("当前开发环境信息--->", data);

  return `
    ${getValueFromConfigInfo(data)}
    API 指向： ${getApiBranch()}
  `.trim();
}

export function getOriginalUrl(url: string) {
  const result =
    /(https?):\/\/((\w+_\w+)\.)?((zh|ja|en)\.)?((cn|com|cnp|comp)\.)?(.+)/.exec(
      url
    );

  const originUrl = result?.[8] || "-";

  return originUrl;
}
