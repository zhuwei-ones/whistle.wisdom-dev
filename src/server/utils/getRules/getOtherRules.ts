import { IncomingMessage } from "http";
import { getApiCurrentPath } from "../getValue";

//【获取规则】其他规则，比如解决跨域，referer
export function getOtherRules(req: IncomingMessage) {
  const currentHost = req.headers.origin; // 当前访问的页面的host，比如 ja.myones.net
  const originHost = `${getApiCurrentPath(currentHost)}`; // 原本的host ,比如 myones.net

  if (!currentHost) {
    return ``;
  }

  return `
      \`\`\`resHeader.txt
      access-control-allow-origin: ${currentHost} 
      \`\`\`
      
      \`\`\`reqHeader.txt
      origin: ${originHost}
      referer: ${originHost}/
      \`\`\`
      
      * resHeaders://{resHeader.txt}  reqHeaders://{reqHeader.txt}
  `;
}
