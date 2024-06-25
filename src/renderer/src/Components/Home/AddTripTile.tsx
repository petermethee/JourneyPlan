import styles from "./AddTripTile.module.css";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { IconButton } from "@mui/material";

export default function AddTripTile({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles.card} onClick={onClick}>
      <IconButton className={styles.iconStyle}>
        <AddRoundedIcon fontSize="large" />
      </IconButton>
    </div>
  );
}
