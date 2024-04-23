import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { app } from "electron";
export const tripImagesPath = join(
  app.getPath("userData"),
  "images",
  "trip_picture",
);
export const attachmentsPath = join(
  app.getPath("userData"),
  "images",
  "attachments",
);
export const dbPath = join(app.getPath("userData"), "journey_plan.db");

export const createProjectFolders = () => {
  if (!existsSync(tripImagesPath)) {
    mkdirSync(tripImagesPath, { recursive: true });
  }

  if (!existsSync(attachmentsPath)) {
    mkdirSync(attachmentsPath, { recursive: true });
  }

  if (!existsSync(dbPath)) {
    copyFileSync("./journey_plan.db", dbPath);
  }
};
