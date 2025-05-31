import path from "path";
import fs from "fs";
import DataService from "./Services/DataService";

const uploadDir = path.resolve(__dirname, "../../uploads");

function cleanupOldFiles() {
  const dataService = new DataService();

  try {
    const files = dataService.getFiles();
    const currentTime = Date.now();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

    let deletedCount = 0;

    for (const [fileId, fileData] of Object.entries(files)) {
      const uploadedAt = new Date(fileData.date).getTime();

      if (currentTime - uploadedAt > thirtyDaysInMs) {
        const filePath = path.resolve(uploadDir, fileData.filepath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted file from filesystem: ${filePath}`);
        }

        dataService.removeFile(fileId);
        deletedCount++;
        console.log(`Deleted file from db.json: ${fileId}`);
      }
    }

    if (deletedCount > 0) {
      console.log(`Updated db.json: Removed ${deletedCount} expired files.`);
    } else {
      console.log("No expired files found.");
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

cleanupOldFiles();
