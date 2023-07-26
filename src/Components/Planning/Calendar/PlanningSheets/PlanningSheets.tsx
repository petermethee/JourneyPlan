import React, { useState } from "react";
import styles from "./PlanningSheets.module.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  deletePlanning,
  insertPlanning,
  selectAllPlannings,
  selectPlanning,
  selectPlanningId,
  updatePlanning,
} from "../../../../features/Redux/planningSlice";
import { IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { selectCurrentTrip } from "../../../../features/Redux/tripSlice";
import CloseIcon from "@mui/icons-material/Close";
import { IPlanning } from "../../../../Models/IPlanningArtifact";

export default function PlanningSheets() {
  const dispatch = useAppDispatch();
  const id_trip = useAppSelector(selectCurrentTrip)?.id;
  const plannings = useAppSelector(selectAllPlannings);
  const selectedPlanning = useAppSelector(selectPlanningId);

  const [editPlanning, setEditPlanning] = useState<null | number>(null);

  const addPlanning = () => {
    dispatch(
      insertPlanning({
        id: 0,
        id_trip: id_trip!,
        name: "new planning",
      })
    )
      .unwrap()
      .then((planning) => {
        setEditPlanning(planning.id);
      });
  };

  const handleBlur = (newName: string, planning: IPlanning) => {
    if (newName !== "" && newName !== planning.name) {
      dispatch(updatePlanning({ ...planning, name: newName }));
    }
    setEditPlanning(null);
  };

  return (
    <div className={styles.planningSheets}>
      <div className={styles.sheetContainer}>
        {plannings.map((planning) => {
          return (
            <div
              key={planning.id}
              className={`${styles.sheet} ${
                selectedPlanning === planning.id && styles.selectedSheet
              }`}
              onClick={() => dispatch(selectPlanning(planning.id))}
            >
              {editPlanning === planning.id ? (
                <TextField
                  sx={{ fontSize: "1rem" }}
                  autoFocus
                  defaultValue={planning.name}
                  margin="none"
                  size="small"
                  variant="standard"
                  onBlur={(event) => handleBlur(event.target.value, planning)}
                />
              ) : (
                <span className={styles.sheetName}> {planning.name}</span>
              )}
              <IconButton
                disabled={plannings.length === 1}
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
        })}
      </div>
      <IconButton onClick={addPlanning} size="small" sx={{ margin: "0px 8px" }}>
        <AddIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
}
