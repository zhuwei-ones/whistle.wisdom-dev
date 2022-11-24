export const ConfigList = ["cn", "com", "cnp", "comp"] as const;

export const LanguageList = ["zh", "ja", "en"] as const;

export const PageAllowHost = [
  "myones.net",
  "ones.com",
  "ones.cn",
  "localhost",
  "127.0.0.1",
  "our.ones.pro",
];

export const OnesConfigList = {
  com: {
    operatingRegion: "com",
    cloudType: "sass",
    serveMode: "sass",
  },
  comp: {
    operatingRegion: "com",
    cloudType: "private",
    serveMode: "standalone",
  },
  cn: {
    operatingRegion: "cn",
    cloudType: "sass",
    serveMode: "sass",
  },
  cnp: {
    operatingRegion: "cn",
    cloudType: "private",
    serveMode: "standalone",
  },
};

export const CommonConfig = {
  LOGIN_ROOT: "/project",
  PROJECT_ROOT: "/project",
  WIKI_ROOT: "/wiki",
  OFFICIAL_ROOT: "/",
  apiDocUrl: "/project/open-api-doc/",
  AUTH_REDIRECT_BASE_URL: "https://ones.cn/api/project/",
};

export const URl_REG =
  /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
