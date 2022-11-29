import { IncomingMessage } from "http";
import * as Cookie from "cookie";

// 注入一段js 脚本，设置当前页面的接口分支
export function getApiBranchConfigRules() {
  const onesConfigRule = `
  \`\`\`apiBranch.js 

    const data = window.name
    let api_branch = ''

    try{
      const obj = JSON.parse(data) ||{};

      api_branch = obj.api_branch || 'master';

      // 清除当前cookie
      document.cookie = \`api_branch=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;

      if(api_branch) {
        document.cookie = \`api_branch=\${api_branch};\`;
      } 

    }catch(e){}
   
  \`\`\`
  
  * jsPrepend://{apiBranch.js} includeFilter://resH:content-type=html
`;

  return onesConfigRule;
}

export function getApiBranchEnvRules(req: IncomingMessage) {
  const cookies = req.headers.cookie;

  const cookiesObj = Cookie.parse(cookies || "");

  const apiBranch = cookiesObj.api_branch;

  if (!apiBranch) {
    return ``;
  }

  const ApiBranchRules = `

        \`\`\`branch.txt
        x-ones-api-branch-project:	/project/${apiBranch}/
        x-ones-api-branch-wiki:	/project/${apiBranch}/
        x-ones-api-branch-stripe:	/project/${apiBranch}/
        \`\`\`
  
        /\\/\\/(.+?)\\..+\\/api\\//  reqHeaders://{branch.txt}
  `;

  return ApiBranchRules;
}

export function getApiBranchRules(req: IncomingMessage) {
  return `
   ${getApiBranchConfigRules()}
    ${getApiBranchEnvRules(req)}
  `;
}
