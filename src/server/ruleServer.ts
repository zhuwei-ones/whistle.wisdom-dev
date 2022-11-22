import { setOnesConfig } from "./rules/env";
import { TokenInfoEnvRules, LangRules, OnesConfigRules } from "./rules";
import { getEnvFromUrl, getEnvInfoFromUrl, getFinalRule } from "./lib/getValue";
import { PageAllowHost } from "./const";

export default (
  server: Whistle.PluginServer,
  options: Whistle.PluginOptions
) => {
  server.on("request", (req, res) => {
    const reqHost = req.headers.host;

    const isAllowHost = PageAllowHost.some(
      (host) => reqHost.indexOf(host) > -1
    );

    if (isAllowHost) {
      const rules = getFinalRule(reqHost);

      console.log("filesdfasdfasdfasdf", rules);

      res.end(rules);
    } else {
      res.end(``);
    }
  });
};
