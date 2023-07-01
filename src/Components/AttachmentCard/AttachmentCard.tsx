import React from "react";
import styles from "./AttachmentCard.module.css";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomCloseIcon from "../Shared/CustomCloseIcon";
import cstmCloseIconStyle from "../Shared/CustomCloseIcon.module.css";

export default function AttachmentCard({
  imagePath,
  imageName,
}: {
  imagePath: string;
  imageName: string;
}) {
  return (
    <div className={styles.container + " " + cstmCloseIconStyle.container}>
      <div className={styles.imageContainer}>
        <img alt="piece jointe" className={styles.image} src={imagePath} />
        <CustomCloseIcon
          sx={{
            right: "5px",
            top: "5px",
          }}
          onDelete={() => {}}
          size="18px"
        />
      </div>

      <label className={styles.label}>{imageName}</label>
    </div>
  );
}
