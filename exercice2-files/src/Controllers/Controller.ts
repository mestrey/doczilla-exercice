import { IncomingMessage, ServerResponse } from "http";

interface Controller {
  handle(req: IncomingMessage, res: ServerResponse): void;
}

export default Controller;
