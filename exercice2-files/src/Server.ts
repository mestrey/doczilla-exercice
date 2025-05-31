import http, { IncomingMessage, ServerResponse } from "http";

type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

class Server {
  private server: http.Server;
  private routes: Map<string, Map<string, RouteHandler>>;

  public constructor() {
    this.server = http.createServer(this.requestListener.bind(this));
    this.routes = new Map();
  }

  private requestListener(req: IncomingMessage, res: ServerResponse): void {
    const { method = "GET", url = "/" } = req;
    const methodRoutes = this.routes.get(method.toUpperCase());

    if (methodRoutes && methodRoutes.has(url)) {
      methodRoutes.get(url)?.(req, res);
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
