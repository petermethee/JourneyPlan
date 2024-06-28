import { useEffect, useState } from "react";
import styles from "./PlanningSheets.module.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  getAllArtifactsPlanning,
  insertPlanning,
  selectAllPlannings,
  selectPlanningId,
  updatePlanning,
} from "../../../../features/Redux/planningSlice";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { selectCurrentTrip } from "../../../../features/Redux/tripSlice";
import { IPlanning } from "../../../../Models/IPlanningArtifact";
import SheetItem from "./SheetItem";
import TotalPrice from "./TotalPrice";
import { EArtifact } from "@renderer/Models/EArtifacts";
import { initUsedAccommodations } from "@renderer/features/Redux/accommodationsSlice";
import { initUsedActivities } from "@renderer/features/Redux/activitiesSlice";
import { initUsedTransports } from "@renderer/features/Redux/transportsSlice";

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
      }),
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

  useEffect(() => {
    if (selectedPlanning) {
      dispatch(getAllArtifactsPlanning(selectedPlanning))
        .unwrap()
        .then((PA) => {
          dispatch(
            initUsedActivities(
              PA.filter((item) => item.artifactType === EArtifact.Activity),
            ),
          );
          dispatch(
            initUsedAccommodations(
              PA.filter(
                (item) => item.artifactType === EArtifact.Accommodation,
              ),
            ),
          );
          dispatch(
            initUsedTransports(
              PA.filter((item) => item.artifactType === EArtifact.Transport),
            ),
          );
        });
    }
  }, [selectedPlanning]);

  return (
    <div className={styles.container}>
      <div className={styles.planningSheets}>
        <div className={styles.sheetContainer}>
          {plannings.map((planning) => (
            <SheetItem
              key={planning.id}
              planning={planning}
              editPlanning={editPlanning}
              setEditPlanning={setEditPlanning}
              disableClose={plannings.length === 1}
              handleBlur={handleBlur}
              selected={planning.id === selectedPlanning}
            />
          ))}
        </div>
        <IconButton
          onClick={addPlanning}
          size="small"
          sx={{ margin: "0px 8px", color: "white" }}
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </div>
      <TotalPrice />
    </div>
  );
}
