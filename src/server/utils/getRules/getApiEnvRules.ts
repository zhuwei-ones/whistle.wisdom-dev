import { IncomingMessage } from "http";
import * as Cookie from "cookie";

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
