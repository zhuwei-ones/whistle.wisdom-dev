import { getAllRule } from "./utils/getValue";
import { PageAllowHost } from "./const";

export default (server: Whistle.PluginServer) => {
  server.on("request", (req, res) => {
    const reqHost = req.headers.host;

    const isAllowHost = PageAllowHost.some(
      (host) => reqHost.indexOf(host) > -1
    );

    if (isAllowHost) {
      const rules = getAllRule(reqHost);

      console.log("host--->", reqHost, "rules--->", rules);

      res.end(rules);
    } else {
      res.end(``);
    }
  });
};
