import { IconButton, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  deletePlanning,
  selectPlanning,
} from "../../../../features/Redux/planningSlice";
import { IPlanning } from "../../../../Models/IPlanningArtifact";
import { useAppDispatch } from "../../../../app/hooks";
import styles from "./SheetItem.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { defaultWhite, primary800 } from "@renderer/style/cssGlobalStyle";

export default function SheetItem({
  planning,
  editPlanning,
  setEditPlanning,
  disableClose,
  handleBlur,
  selected,
}: {
  planning: IPlanning;
  editPlanning: number | null;
  setEditPlanning: (id: number) => void;
  disableClose: boolean;
  handleBlur: (newName: string, planning: IPlanning) => void;
  selected: boolean;
}) {
  const dispatch = useAppDispatch();
  const nameRef = useRef<HTMLDivElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  const [currentName, setCurrentName] = useState(planning.name);

  useEffect(() => {
    nameRef.current && setInputWidth(nameRef.current.clientWidth);
  }, []);

  return (
    <div
      key={planning.id}
      className={`${styles.sheet} ${selected && styles.selectedSheet}`}
      onClick={
        !selected ? () => dispatch(selectPlanning(planning.id)) : undefined
      }
      onDoubleClick={() => setEditPlanning(planning.id)}
    >
      {editPlanning === planning.id ? (
        <>
          <TextField
            sx={{ fontSize: "1rem" }}
            autoFocus
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            margin="none"
            size="small"
            variant="standard"
            inputProps={{
              style: { width: inputWidth },
              onKeyDown: (e) => {
                e.key === "Enter" && e.currentTarget.blur();
              },
            }}
            onBlur={(event) => handleBlur(event.target.value, planning)}
          />
        </>
      ) : (
        <div className={styles.sheetName} ref={nameRef}>
          {planning.name}
        </div>
      )}
      <IconButton
        disabled={disableClose}
        onClick={(event) => {
          event.stopPropagation();
          dispatch(deletePlanning(planning.id));
        }}
        size="small"
      >
        <CloseIcon
          sx={{
            fontSize: "12px",
            color: disableClose
              ? "undefined"
              : selected
                ? primary800
                : defaultWhite,
          }}
        />
      </IconButton>
    </div>
  );
}
