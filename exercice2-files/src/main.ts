import { IncomingMessage, ServerResponse } from "http";
import Server from "./Server";

const server = new Server();

server.addRoute("GET", "/", (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!");
});

server.start(4000, () => {
  console.log("Server is running on http://127.0.0.1:4000");
});
