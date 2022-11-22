export const OperationOriginList = [
  {
    label: "国内",
    value: "cn",
  },
  {
    label: "海外",
    value: "com",
  },
];

export const CloudTypeList = [
  {
    label: "Sass",
    value: "sass",
  },
  {
    label: "私有部署",
    value: "private",
  },
];

export const LanguageList = [
  {
    label: "中文",
    value: "zh",
  },
  {
    label: "英文",
    value: "en",
  },
  {
    label: "日语",
    value: "ja",
  },
];

export const FormKeys = {
  origin: "origin",
  cloud: "cloud",
  lang: "lang",
};

export const DataKeys = {
  [FormKeys.origin]: "operatingRegion",
  [FormKeys.cloud]: "cloudType",
  [FormKeys.lang]: "language",
};

export const DefaultValue = {
  [FormKeys.cloud]: CloudTypeList[0].value,
};

export const PanelConfigList = [
  {
    title: "选择地域",
    options: OperationOriginList,
    key: FormKeys.origin,
  },
  {
    title: "选择环境",
    options: CloudTypeList,
    key: FormKeys.cloud,
  },
  {
    title: "选择语言",
    options: LanguageList,
    key: FormKeys.lang,
  },
];

export const PageAllowOrigin = [
  "myones.net",
  "ones.com",
  "ones.cn",
  "localhost",
  "127.0.0.1",
];
