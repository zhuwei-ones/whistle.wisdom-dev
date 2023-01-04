/// <reference types="node" />

import { IncomingMessage, ServerResponse, Server } from "http";
import { ParsedUrlQuery } from "querystring";
import { Socket } from "net";

declare global {
  namespace WhistleBase {
    class Request extends IncomingMessage {
      originalReq?: {
        url: string;
      };
    }
    class Response extends ServerResponse {}
    class HttpServer extends Server {}
    class Socks extends Socket {}
    type UrlQuery = ParsedUrlQuery;
  }
  interface Window {
    onesConfig: {};
    commonConfig: {};
  }
}
