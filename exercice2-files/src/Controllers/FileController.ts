import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";

import Controller from "./Controller";
import DataService from "../Services/DataService";
import Server from "../Server";

class FileController implements Controller {
  public constructor(private dataService: DataService) {}

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const queryParams = (req as any).queryParams;
    const id = queryParams?.id;

    if (!id) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Specify the file ID");
      return;
    }

    try {
      const file = this.dataService.getFileById(id);
      if (!file) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
        return;
      }

      const filePath = file.filepath;
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found on the server");
        return;
      }

      const mimeType = Server.getMimeType(filePath);
      res.writeHead(200, {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${path.basename(filePath)}"`,
      });

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      fileStream.on("error", (err) => {
        console.error("Error reading file:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      });
    } catch (e) {
      console.error("Error while opening file:", e);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error while opening file");
    }
  }
}

export default FileController;
