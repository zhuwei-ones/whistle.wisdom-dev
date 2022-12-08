import { IncomingMessage } from "http";
import * as Cookie from "cookie";
import { HOST_REG } from "../../const";

// 注入一段js 脚本，设置当前页面的接口分支
export function getApiBranchConfigRules() {
  const onesConfigRule = `
    \`\`\`apiBranch.js 

      const data = window.name
      let api_branch = ''

      try{
        const obj = JSON.parse(data) ||{};

        api_branch = obj.api_branch ;

        // 清除当前cookie
        document.cookie = \`api_branch=; expires='Mon, 26 Jul 1997 05:00:00 GMT';\`;

        document.cookie = \`api_branch=\${api_branch};\`;

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
  const isBranch = !HOST_REG.test(apiBranch);

  if (!apiBranch) {
    return ``;
  }

  return ``;

  // x-ones-api-host: https://mars-dev.myones.net:16416/project/api/project/

  const ApiBranchRules = `
    \`\`\`branch.txt
    x-ones-api-branch-project:	/project/${apiBranch}/
    x-ones-api-branch-wiki:	/project/${apiBranch}/
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
    ${getApiBranchConfigRules()}
    ${getApiBranchEnvRules(req)}
  `;
}
