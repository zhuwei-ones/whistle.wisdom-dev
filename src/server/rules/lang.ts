/**
 * 
    /\/\/(.+?)\..+\/api\// reqCookies://{$1.json} reqHeaders://accept-language=$1 resReplace://{$1.txt} resCookies://{$1.json} 
 
 */
export const LangRules = {
  zh: {
    json: {
      value: "zh",
      maxAge: 600000000,
      path: "/",
    },
    rule: `/\"language\"\:\".+?\"/ig: ""language":"zh""`,
  },

  en: {
    json: {
      value: "en",
      maxAge: 600000000,
      path: "/",
    },
    rule: `/\"language\"\:\".+?\"/ig: ""language":"en""`,
  },

  ja: {
    json: {
      value: "ja",
      maxAge: 600000000,
      path: "/",
    },
    rule: `/\"language\"\:\".+?\"/ig: ""language":"ja""`,
  },
};
