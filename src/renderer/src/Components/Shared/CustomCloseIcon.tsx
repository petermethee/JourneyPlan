import { IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./CustomCloseIcon.module.css";

export default function CustomCloseIcon({
  onDelete,
  size,
  center,
  sx,
}: {
  onDelete: () => void;
  size: string;
  center?: boolean;
  sx?: React.CSSProperties;
}) {
  return (
    <IconButton
      onClick={onDelete}
      onMouseDown={(e) => e.stopPropagation()} //stop propagation to prevent edit mode
      size="small"
      sx={{
        transition: "300ms",
        position: "absolute",
        padding: "2px",
        backgroundColor: " #3030309f",
        "&:hover": { backgroundColor: "#303030dd" },
        ...sx,
      }}
      className={`${styles.deleteIcon} ${center && styles.center}`}
    >
      <CloseIcon
        sx={{
          fontSize: size,
          color: "white",
        }}
      />
    </IconButton>
  );
}
