import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import fs from "fs";

import Controller from "./Controller";
import DataService from "../Services/DataService";

class DashboardController implements Controller {
  public constructor(private dataService: DataService) {}

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const files = this.dataService.getFiles();

    const genHtml = Object.entries(files)
      .map(([fileid, fileData]) => {
        const formatFileSize = (sizeInBytes: number): string => {
          if (sizeInBytes < 1024) return `${sizeInBytes} B`;
          if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
          return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
        };

        const formatDate = (isoDate: string): string => {
          const options: Intl.DateTimeFormatOptions = {
            month: "short",
            day: "numeric",
            year: "numeric",
          };
          return new Date(isoDate).toLocaleDateString("en-US", options);
        };

        return `<tr><td><div class="file-info"><div class="file-icon"><i class="fas fa-file"></i></div>
          <div>
            <div class="file-name">${fileData.originalFilename}</div>
          </div></div></td>
          <td>
            1
          </td>
          <td class="file-size">
            ${formatFileSize(fileData.size)}
          </td>
          <td class="file-date">
            ${formatDate(fileData.date)}
          </td>
          <td><div class="file-actions-cell">
            <a href="/f?id=${fileData.fileid}" class="copy-link" style="text-decoration: none">
              <div class="action-btn"><i class="fas fa-share-alt"></i></div>
            </a>
          </div>
        </td></tr>`;
      })
      .join("");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(path.join(__dirname, "../../views/dashboard.html"), "utf8").replace("{{files}}", genHtml));
  }
}

export default DashboardController;
