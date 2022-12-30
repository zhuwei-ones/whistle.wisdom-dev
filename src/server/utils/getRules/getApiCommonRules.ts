import {
  getApiCurrentPath,
  getCorrectUrlEntry,
  getEnvUrlReg
} from "../getValue";
import parse = require("url-parse");

//【获取规则】api 接口导去正确域名（过滤前面自定义添加的域名，比如 zh.com.xxx.xx)
export function getApiToCurrectHostRules() {
  return `/${getEnvUrlReg()}/ $1://$6`;
}

//【获取规则】其他规则，比如解决跨域，referer
export function getApiCorsRules(req: Whistle.PluginRequest) {
  const currentUrl = getCorrectUrlEntry(req);
  const { origin: allowOrigin } = parse(currentUrl); // 当前访问的页面的host，比如 ja.myones.net
  const correctHost = `${getApiCurrentPath(currentUrl)}`; // 原本的host ,比如 myones.net

  const headers = req.originalReq.headers;
  const allowHeaders = headers?.["access-control-request-headers"];
  let allowHeaderRules = ``;

  // console.log("correctHost", correctHost);
  // console.log("currentUrl", currentUrl);

  if (!allowOrigin) {
    return ``;
  }

  if (allowHeaders) {
    allowHeaderRules = `
    Access-Control-Allow-Headers: ${allowHeaders}
    `;
  }

  /**
   * 不使用 * 跨域的原因
   * The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'
   */

  return `
      \`\`\`accessResponseHeader.txt
      access-control-allow-origin:  ${allowOrigin}
      access-control-allow-credentials: true
      Access-Control-Allow-Methods: GET, POST, PUT, PATCH, POST, DELETE, OPTIONS
      ${allowHeaderRules}
      \`\`\`
      
      \`\`\`accessRequestHeader.txt
      origin: ${correctHost}
      referer: ${correctHost}/
      \`\`\`
      
      * resHeaders://{accessResponseHeader.txt}  reqHeaders://{accessRequestHeader.txt} statusCode://200

      /\\/\\/(.+?)\\..+\\/api\\// includeFilter://m:options replaceStatus://200
    
  `;
}

export function getApiCommonRules(req: WhistleBase.Request) {
  return `
  ${getApiToCurrectHostRules()}
  ${getApiCorsRules(req as Whistle.PluginRequest)}
`;
}
