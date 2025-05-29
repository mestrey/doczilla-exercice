import { ServerResponse } from "http";

const http = require("http");
const fs = require("fs");
const path = require("path");

class Visualizator {
  public constructor(private input: string[][], private moves: number[][], private capacity: number) {}

  public async startServer() {
    const server = http.createServer((req: Request, res: ServerResponse) => {
      if (req.url !== "/") {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not Found");

        return;
      }

      fs.readFile(path.join(__dirname, "../view/visual.html"), (err: Error, data: string) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.end("Internal Server Error");

          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
          data
            .toString()
            .replace("{{capacity}}", JSON.stringify(this.capacity))
            .replace("{{input}}", JSON.stringify(this.input))
            .replace("{{moves}}", JSON.stringify(this.moves))
        );
      });
    });

    server.listen(3000, "127.0.0.1", () => {
      console.log(`Server running at http://127.0.0.1:3000/`);
    });
  }
}

export default Visualizator;
