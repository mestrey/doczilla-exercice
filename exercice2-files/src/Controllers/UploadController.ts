import { IncomingMessage, ServerResponse } from "http";

import path from "path";
import fs from "fs";
import * as formidable from "formidable";

import Controller from "./Controller";

class UploadController implements Controller {
  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (!req.headers["content-type"]?.startsWith("multipart/form-data")) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request: Expected multipart/form-data");
      return;
    }

    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: true,
    });

    form.parse(req, (err: Error, fields: formidable.Fields<string>, files: formidable.Files<"files">) => {
      if (err) {
        console.error("Error parsing form data:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }

      console.log("Uploaded files:", files);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Files uploaded successfully",
          files: Array.isArray(files.files)
            ? files.files.map((file: { newFilename: string }) => file.newFilename)
            : [(files.files! as unknown as { newFilename: string }).newFilename],
        })
      );
    });
  }
}

export default UploadController;
