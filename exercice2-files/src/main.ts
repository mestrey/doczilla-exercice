import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";

import Server from "./Server";
import Auth from "./Auth";
import LoginController from "./Controllers/LoginController";
import UploadController from "./Controllers/UploadController";
import DashboardController from "./Controllers/DashboardController";

const server = new Server();
const auth = new Auth("secret-123");

server.addRoute("GET", "/", (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(fs.readFileSync(path.join(__dirname, "../views/home.html"), "utf8"));
});

server.addRoute("GET", "/dashboard", async (req: IncomingMessage, res: ServerResponse) => {
  if (!server.isAuth(auth, req, res)) return;
  await new DashboardController().handle(req, res);
});

server.addRoute("GET", "/upload", (req: IncomingMessage, res: ServerResponse) => {
  if (!server.isAuth(auth, req, res)) return;
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(fs.readFileSync(path.join(__dirname, "../views/upload.html"), "utf8"));
});

server.addRoute("POST", "/upload", async (req: IncomingMessage, res: ServerResponse) => {
  if (!server.isAuth(auth, req, res)) return;
  await new UploadController().handle(req, res);
});

server.addRoute("POST", "/login", async (req: IncomingMessage, res: ServerResponse) => {
  await new LoginController(auth).handle(req, res);
});

server.addRoute("GET", "/f", (req: IncomingMessage, res: ServerResponse) => {});

server.addRoute("GET", "/css", (req: IncomingMessage, res: ServerResponse) => {
  const queryParams = (req as any).queryParams;
  const file = queryParams?.file;
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/css" });
  res.end(fs.readFileSync(path.join(__dirname, "../resources/css/" + file), "utf8"));
});

server.start(4000, () => {
  console.log("Server is running on http://127.0.0.1:4000");
});
