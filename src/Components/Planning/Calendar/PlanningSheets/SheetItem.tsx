import { IconButton, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  selectPlanning,
  deletePlanning,
  selectPlanningId,
  getAllArtifactsPlanning,
} from "../../../../features/Redux/planningSlice";
import { IPlanning } from "../../../../Models/IPlanningArtifact";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import styles from "./SheetItem.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { EArtifact } from "../../../../Models/EArtifacts";
import { initUsedAccommodations } from "../../../../features/Redux/accommodationsSlice";
import { initUsedActivities } from "../../../../features/Redux/activitiesSlice";
import { initUsedTransports } from "../../../../features/Redux/transportsSlice";

export default function SheetItem({
  planning,
  editPlanning,
  setEditPlanning,
  disableClose,
  handleBlur,
}: {
  planning: IPlanning;
  editPlanning: number | null;
  setEditPlanning: (id: number) => void;
  disableClose: boolean;
  handleBlur: (newName: string, planning: IPlanning) => void;
}) {
  const dispatch = useAppDispatch();
  const selectedPlanning = useAppSelector(selectPlanningId);
  const nameRef = useRef<HTMLDivElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  const [currentName, setCurrentName] = useState(planning.name);

  const handleClick = () => {
    dispatch(selectPlanning(planning.id));
    dispatch(getAllArtifactsPlanning(planning.id))
      .unwrap()
      .then((PA) => {
        dispatch(
          initUsedActivities(
            PA.filter((item) => item.artifactType === EArtifact.Activity)
          )
        );
        dispatch(
          initUsedAccommodations(
            PA.filter((item) => item.artifactType === EArtifact.Accommodation)
          )
        );
        dispatch(
          initUsedTransports(
            PA.filter((item) => item.artifactType === EArtifact.Transport)
          )
        );
      });
  };

  useEffect(() => {
    nameRef.current && setInputWidth(nameRef.current.clientWidth);
  }, []);

  return (
    <div
      key={planning.id}
      className={`${styles.sheet} ${
        selectedPlanning === planning.id && styles.selectedSheet
      }`}
      onClick={handleClick}
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
        <div
          onMouseDown={(e) => e.preventDefault()}
          className={styles.sheetName}
          ref={nameRef}
        >
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
            color: selectedPlanning === planning.id ? "black" : "white",
          }}
        />
      </IconButton>
    </div>
  );
}
