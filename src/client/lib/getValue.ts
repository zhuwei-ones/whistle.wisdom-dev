import { PanelConfigList } from "const";

// 从配置信息中翻译出来中文
export function getValueFromConfigInfo(config) {
  const envName = Object.keys(config).map((key) => {
    const item = PanelConfigList.filter((item) => item.key === key)?.[0];

    const value = config[key];

    const currentName = item.options.filter((item) => item.value === value)?.[0]?.label;

    return currentName;
  }).filter(i=>i)

  return envName.length > 0 ? `当前环境：${envName.join("-") }`: "智慧开发";
}


/**
 * 1、从 cookie 中获取 语言
 * 2、从 onesConfig 中 获取 origin 和 cloudType
 */
export function getEnvInfoFormConfig(){

}