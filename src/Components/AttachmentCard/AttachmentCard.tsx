import React from "react";
import styles from "./AttachmentCard.module.css";
export default function AttachmentCard({
  imagePath,
  imageName,
}: {
  imagePath: string;
  imageName: string;
}) {
  return (
    <div className={styles.container}>
      <img
        alt="piece jointe"
        className={styles.imageContainer}
        src={imagePath}
      />
      <label className={styles.label}>{imageName}</label>
    </div>
  );
}
