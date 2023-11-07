import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const projectName = "journey_plan";

export const tripImagesPath = join(
  process.env.APPDATA!,
  projectName,
  "images",
  "trip_picture"
);
export const attachmentsPath = join(
  process.env.APPDATA!,
  projectName,
  "images",
  "attachments"
);

export const createProjectFolders = () => {
  if (!existsSync(tripImagesPath)) {
    mkdirSync(tripImagesPath, { recursive: true });
  }

  if (!existsSync(attachmentsPath)) {
    mkdirSync(attachmentsPath, { recursive: true });
  }
};
