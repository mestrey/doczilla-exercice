import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";

import Auth from "./Auth";

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

class Server {
  private server: http.Server;
  private routes: Map<string, Map<string, RouteHandler>>;

  public constructor() {
    this.server = http.createServer(this.requestListener.bind(this));
    this.routes = new Map();
  }

  public isAuth(auth: Auth, req: IncomingMessage, res: ServerResponse) {
    const queryParams = (req as any).queryParams;
    const token = queryParams?.token;

    if (!token) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Unauthorized: Missing token in query parameters");
      return false;
    }

    const decoded = auth.verifyJWT(token);
    if (!decoded) {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Unauthorized: Invalid or expired token");

      return false;
    }

    return true;
  }

  private requestListener(req: IncomingMessage, res: ServerResponse): void {
    const { method = "GET", url: rawUrl = "/" } = req;

    const parsedUrl = url.parse(rawUrl, true);
    const path = parsedUrl.pathname || "/";
    const queryParams = parsedUrl.query;

    const methodRoutes = this.routes.get(method.toUpperCase());

    if (methodRoutes && methodRoutes.has(path)) {
      (req as any).queryParams = queryParams;
      methodRoutes.get(path)?.(req, res);

      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }

  public addRoute(method: string, path: string, handler: RouteHandler): void {
    method = method.toUpperCase();
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }

    this.routes.get(method)!.set(path, handler);
  }

  public start(port: number, callback?: () => void): void {
    this.server.listen(port, "127.0.0.1", callback);
  }
}

export default Server;
