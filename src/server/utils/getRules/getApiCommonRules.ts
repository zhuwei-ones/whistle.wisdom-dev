import { IncomingMessage } from "http";
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
export function getApiCorsRules(req: IncomingMessage) {
  const currentUrl = getCorrectUrlEntry(req);
  const { origin: allowOrigin } = parse(currentUrl); // 当前访问的页面的host，比如 ja.myones.net
  const correctHost = `${getApiCurrentPath(currentUrl)}`; // 原本的host ,比如 myones.net

  console.log("correctHost", correctHost);

  if (!allowOrigin) {
    return ``;
  }

  return `
      \`\`\`resHeader.txt
      access-control-allow-origin: ${allowOrigin} 
      \`\`\`
      
      \`\`\`reqHeader.txt
      origin: ${correctHost}
      referer: ${correctHost}/
      \`\`\`
      
      * resHeaders://{resHeader.txt}  reqHeaders://{reqHeader.txt}
  `;
}

export function getApiCommonRules(req: IncomingMessage) {
  return `
  ${getApiToCurrectHostRules()}
  ${getApiCorsRules(req)}
`;
}
