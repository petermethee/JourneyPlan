import CustomCloseIcon from "../../Shared/CustomCloseIcon";
import cstmCloseIconStyle from "../../Shared/CustomCloseIcon.module.css";
import styles from "./AttachmentCard.module.css";

export default function AttachmentCard({
  imagePath,
  imageName,
  onDelete,
}: {
  imagePath: string;
  imageName: string;
  onDelete: () => void;
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
          onDelete={onDelete}
          size="18px"
        />
      </div>

      <label className={styles.label}>{imageName}</label>
    </div>
  );
}
