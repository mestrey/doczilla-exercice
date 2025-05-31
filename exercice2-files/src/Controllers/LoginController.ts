import { IncomingMessage, ServerResponse } from "http";

import Controller from "./Controller";
import Auth from "../Auth";

class LoginController implements Controller {
  constructor(private auth: Auth) {}

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const data = Buffer.concat(buffers).toString();
      const { email, password } = JSON.parse(data);

      if (email === "admin@admin.com" && password === "admin") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Login successful",
            user: { email },
            token: this.auth.generateJWT({ email }),
          })
        );
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid credentials" }));
      }
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Bad request" }));
    }
  }
}

export default LoginController;
