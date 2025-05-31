import path from "path";
import fs from "fs";

class DataService {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(__dirname, "../../db.json");
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ files: {} }), "utf8");
    }
  }

  public getFiles(): { [fileid: string]: any } {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      const jsonData = JSON.parse(data);

      if (typeof jsonData.files === "object" && jsonData.files !== null) {
        return jsonData.files;
      } else {
        throw new Error("Invalid data structure in db.json: 'files' is not an object.");
      }
    } catch (error) {
      console.error("Error reading or parsing db.json:", error);
      throw error;
    }
  }

  private saveFiles(files: { [fileid: string]: any }): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify({ files }, null, 2), "utf8");
    } catch (error) {
      console.error("Error writing to db.json:", error);
      throw error;
    }
  }

  public addFile(fileid: string, fileData: any): boolean {
    try {
      const files = this.getFiles();

      if (files[fileid]) {
        console.log(`File with fileid "${fileid}" already exists in db.json.`);
        return false;
      }

      files[fileid] = {
        fileid: fileid,
        newFilename: fileData.newFilename,
        date: new Date().toISOString().slice(0, 10),
        filepath: fileData.filepath,
        originalFilename: fileData.originalFilename,
        mimetype: fileData.mimetype,
        size: fileData.size,
      };
      this.saveFiles(files);

      console.log(`File with fileid "${fileid}" added to db.json.`);
      return true;
    } catch (error) {
      console.error("Error adding file to db.json:", error);
      throw error;
    }
  }

  public removeFile(fileid: string): boolean {
    try {
      const files = this.getFiles();

      if (!files[fileid]) {
        console.log(`File with fileid "${fileid}" does not exist in db.json.`);
        return false;
      }

      delete files[fileid];

      this.saveFiles(files);

      console.log(`File with fileid "${fileid}" removed from db.json.`);
      return true;
    } catch (error) {
      console.error("Error removing file from db.json:", error);
      throw error;
    }
  }

  public getFileById(fileid: string): any | null {
    try {
      const files = this.getFiles();

      return files[fileid] || null;
    } catch (error) {
      console.error("Error retrieving file from db.json:", error);
      throw error;
    }
  }
}

export default DataService;
