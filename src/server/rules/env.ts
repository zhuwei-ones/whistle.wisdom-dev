/**
 * 
/\/\/(.+?)\.(.+)\/token_info/  resReplace://{$1.txt} 
 */

export const TokenInfoEnvRules = {
  com: `
          /\"ones\:instance:operatingRegion\"\:\".+?\"/ig: ""ones:instance:operatingRegion":"com""
          /\"ones\:instance:serveMode\"\:\".+?\"/ig: ""ones:instance:serveMode":"sass""
      `,
  cn: `
          /\"ones\:instance:operatingRegion\"\:\".+?\"/ig: ""ones:instance:operatingRegion":"cn""
          /\"ones\:instance:serveMode\"\:\".+?\"/ig: ""ones:instance:serveMode":"sass""
      `,
  comp: `
          /\"ones\:instance:operatingRegion\"\:\".+?\"/ig: ""ones:instance:operatingRegion":"com""
          /\"ones\:instance:serveMode\"\:\".+?\"/ig: ""ones:instance:serveMode":"standalone""
    `,
  cnp: `
          /\"ones\:instance:operatingRegion\"\:\".+?\"/ig: ""ones:instance:operatingRegion":"cn""
          /\"ones\:instance:serveMode\"\:\".+?\"/ig: ""ones:instance:serveMode":"standalone""
    `,
};

export const CommonConfig = {
  LOGIN_ROOT: "/project",
  PROJECT_ROOT: "/project",
  WIKI_ROOT: "/wiki",
  OFFICIAL_ROOT: "/",
  apiDocUrl: "/project/open-api-doc/",
  AUTH_REDIRECT_BASE_URL: "https://ones.cn/api/project/",
};

export const CommonConfigStr = JSON.stringify(CommonConfig);

export const setOnesConfig = () => {
  if (typeof window === "undefined") {
    return;
  }

  console.log("hostname", location.hostname);

  const hostname = location.hostname;
  const result = hostname.match(/^(.+?)\./) || [];
  const prefix = result[1];

  console.log("prefix", prefix);

  let config = {};
  if (prefix === "cn") {
    config = {
      cloudType: "sass",
      operatingRegion: "cn",
    };
  } else if (prefix === "com") {
    config = {
      cloudType: "sass",
      operatingRegion: "com",
    };
  } else if (prefix === "cnp") {
    config = {
      cloudType: "private",
      operatingRegion: "cn",
    };
  } else if (prefix === "comp") {
    config = {
      cloudType: "private",
      operatingRegion: "com",
    };
  }

  if (!window.onesConfig) {
    window.onesConfig = Object.assign(CommonConfigStr, config);
  } else {
    window.onesConfig = Object.assign(
      window.onesConfig,
      CommonConfigStr,
      config
    );
  }
};

export const OnesConfigRules = `

    \`\`\`onesConfig.js

    (${setOnesConfig.toString()}())

    \`\`\`

    \/myones.net\\/project\/   jsPrepend://{onesConfig.js}  includeFilter://resH:content-type=html

`;
