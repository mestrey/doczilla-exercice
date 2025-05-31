import { IncomingMessage, ServerResponse } from "http";

import path from "path";
import fs from "fs";

import Controller from "./Controller";

class DashboardController implements Controller {
  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    /*
<tr>
    <td>
    <div class="file-info">
        <div class="file-icon">
        <i class="fas fa-file"></i>
        </div>
        <div>
        <div class="file-name">Project Assets.zip</div>
        </div>
    </div>
    </td>
    <td>2</td>
    <td class="file-size">87.3 MB</td>
    <td class="file-date">Jun 18, 2023</td>
    <td>
    <div class="file-actions-cell">
        <div class="action-btn"><i class="fas fa-share-alt"></i></div>
    </div>
    </td>
</tr>
*/

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(path.join(__dirname, "../../views/dashboard.html"), "utf8"));
  }
}

export default DashboardController;
