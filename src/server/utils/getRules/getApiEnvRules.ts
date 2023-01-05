import { IncomingMessage } from "http";
import * as Cookie from "cookie";
import parse = require("url-parse");
import { EXPIRE_COOKIE_TIME, HOST_REG } from "../../const";
import {
  getCorrectEnvBranchName,
  getCorrectUrlEntry,
  getOriginalHostname
} from "../getValue";

// 注入一段js 脚本，设置当前页面的接口分支
export function getApiBranchConfigRules(req: IncomingMessage) {
  const currentUrl = getCorrectUrlEntry(req);
  const { origin: allowOrigin } = parse(currentUrl); // 当前访问的页面的host，比如 ja.myones.net
  const domain = `.${getOriginalHostname(allowOrigin)}`;

  /**
   * api_branch cookie 因为属于子域名，接口是父域名，所以携带不上
   * 现在把 api_branch 设置为父域名，并且加上环境标识字段来区分不同环境的 接口指向
   */
  const branchName = getCorrectEnvBranchName(req);

  const onesConfigRule = `
    \`\`\`apiBranch.js 

      const data = window.name
      let api_branch = ''

      try{
        const obj = JSON.parse(data) || {};

        api_branch = obj.api_branch ;

        var domain = \`domain=${domain}\`;

        // 清除当前cookie
        document.cookie = \`${branchName}=; expires='${EXPIRE_COOKIE_TIME}';\`;

        document.cookie = \`${branchName}=\${api_branch}; \${domain} \`;

      }catch(e){
        console.log("api 指向失败",e)
      }
    
    \`\`\`
    
    * jsPrepend://{apiBranch.js} includeFilter://resH:content-type=html
  `;

  return onesConfigRule;
}

export function getApiBranchEnvRules(req: IncomingMessage) {
  const cookies = req.headers.cookie;
  const cookiesObj = Cookie.parse(cookies || "");

  const branchName = getCorrectEnvBranchName(req);
  const apiBranch = cookiesObj[branchName];
  const isBranch = !HOST_REG.test(apiBranch);

  if (!apiBranch) {
    return ``;
  }

  // x-ones-api-host: https://mars-dev.myones.net:16416/project/api/project/

  const ApiBranchRules = `
    \`\`\`branch.txt
    x-ones-api-branch-project:	/project/${apiBranch}/
    x-ones-api-branch-wiki:	/project/${apiBranch}/
    x-ones-api-branch-stripe:	/project/${apiBranch}/
    \`\`\`

    /\\/\\/(.+?)\\..+\\/api\\//  reqHeaders://{branch.txt}
  `;

  const ApiHostRules = `
    \`\`\`branch.txt
    x-ones-api-host:	${apiBranch}/project/api/project/
    \`\`\`

    /\\/\\/(.+?)\\..+\\/api\\//  reqHeaders://{branch.txt}/project/api/project/
  `;

  return isBranch ? ApiBranchRules : ApiHostRules;
}

export function getApiBranchRules(req: IncomingMessage) {
  return `
    ${getApiBranchConfigRules(req)}
    ${getApiBranchEnvRules(req)}
  `;
}
