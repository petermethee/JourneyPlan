import styles from "./DropBackdrop.module.css";
import DownloadIcon from "@mui/icons-material/Download";

export default function DropBackdrop({ dragActive }: { dragActive: boolean }) {
  return (
    <div className={styles.dropLabel} style={{ opacity: dragActive ? 1 : 0 }}>
      <DownloadIcon />
      Lâcher le document ici (PDF, JPG, PNG)
    </div>
  );
}
