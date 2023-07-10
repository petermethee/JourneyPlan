import styles from "./SideData.module.css";
import draggableStyle from "../DraggableCardView.module.css";

import draggableStyles from "../../Planning/DraggableCardView.module.css";
import { useMemo, useRef, useState } from "react";
import {
  getDraggableAccomodationSideDataStyle,
  getDraggableSideDataStyle,
  getFinalDestination,
  getFinalDestinationInAccomodationDZ,
  sideDataTop,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { sideDataDragContainerStyle } from "../../../DnDCustomLib/DraggableCSS";
import { useAppSelector } from "../../../app/hooks";
import { selectActivities } from "../../../features/Redux/activitiesSlice";
import DraggableCardView from "../DraggableCardView";
import SideDataHeader from "./SideDataHeader";
import { selectTransports } from "../../../features/Redux/transportsSlice";
import { selectAccomodations } from "../../../features/Redux/accomodationsSlice";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActivityDataCard from "../ArtifactsDataCard/ActivityDataCard";
import { EArtifact } from "../../../Models/EArtifacts";
import TransportDataCard from "../ArtifactsDataCard/TransportDataCard";
import AccomodationDataCard from "../ArtifactsDataCard/AccomodationDataCard";
import ArtifactTemplate from "../ArtifactsDataCard/ArtifactTemplate";
import {
  accomodationColor,
  accomodationSecColor,
  activityColor,
  activitySecColor,
  defaultWhite,
  transportColor,
  transportSecColor,
} from "../../../style/cssGlobalStyle";
import ActivityIcon from "../../Shared/ActivityIcon";
import TransportIcon from "../../Shared/TransportIcon";
import AccomodationIcon from "../../Shared/AccomodationIcon";
import { TArtifactEditor } from "../Planning";

export const SIDE_DATA_COL_ID = "sideDataDropId";

export default function SideData({
  openArtifactEditor,
  isEditorOpen,
}: {
  openArtifactEditor: (artifactEditor: TArtifactEditor) => void;
  isEditorOpen: boolean;
}) {
  const sideDataRef = useRef<HTMLDivElement>(null);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const [usedFilter, setUsedFilter] = useState<0 | 1>(0);
  const [marginTop, setMarginTop] = useState(0);
  const [currentArtifactType, setCurrentArtifactType] = useState(
    EArtifact.Activity
  );

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => activity.used === usedFilter);
  }, [activities, usedFilter]);

  const filteredTransports = useMemo(() => {
    return transports.filter((transport) => transport.used === usedFilter);
  }, [transports, usedFilter]);

  const filteredAccomodations = useMemo(() => {
    return accomodations.filter(
      (accomodation) => accomodation.used === usedFilter
    );
  }, [accomodations, usedFilter]);

  const currentArtifacts = useMemo(() => {
    switch (currentArtifactType) {
      case EArtifact.Activity:
        return filteredActivities.map((activity) => (
          <DraggableCardView
            key={"activity-" + activity.id}
            artifactId={activity.id}
            containerStyle={sideDataDragContainerStyle()}
            duration={activity.duration}
            shwoCaseClass={draggableStyle.showcaseSideData}
            source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
            getDraggableStyle={getDraggableSideDataStyle}
            disappearAnim={
              activity.used ? "" : draggableStyles.sideDataDisappearAnim
            }
            artifactType={EArtifact.Activity}
            getFinalDestination={getFinalDestination}
            editArtifact={() =>
              openArtifactEditor({
                type: EArtifact.Activity,
                artifact: activity,
              })
            }
          >
            {(onDeleteFromPlanning, onDelete, isDragged) => (
              <ArtifactTemplate
                artifact={activity}
                isDragged={isDragged}
                onDeleteFromPlanning={onDeleteFromPlanning}
                onDelete={onDelete}
                duration={activity.duration}
                artifactColor={activityColor}
                artifactSecColor={activitySecColor}
                artifactIcon={<ActivityIcon color={defaultWhite} />}
              >
                <ActivityDataCard activity={activity} />
              </ArtifactTemplate>
            )}
          </DraggableCardView>
        ));
      case EArtifact.Transport:
        return filteredTransports.map((transport) => (
          <DraggableCardView
            key={"transport-" + transport.id}
            artifactId={transport.id}
            containerStyle={sideDataDragContainerStyle()}
            duration={transport.duration}
            shwoCaseClass={draggableStyle.showcaseSideData}
            source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
            getDraggableStyle={getDraggableSideDataStyle}
            disappearAnim={
              transport.used ? "" : draggableStyles.sideDataDisappearAnim
            }
            artifactType={EArtifact.Transport}
            getFinalDestination={getFinalDestination}
            editArtifact={() =>
              openArtifactEditor({
                type: EArtifact.Transport,
                artifact: transport,
              })
            }
          >
            {(onDeleteFromPlanning, onDelete, isDragged) => (
              <ArtifactTemplate
                artifact={transport}
                isDragged={isDragged}
                onDeleteFromPlanning={onDeleteFromPlanning}
                onDelete={onDelete}
                duration={transport.duration}
                artifactColor={transportColor}
                artifactSecColor={transportSecColor}
                artifactIcon={<TransportIcon color={defaultWhite} />}
              >
                <TransportDataCard transport={transport} />
              </ArtifactTemplate>
            )}
          </DraggableCardView>
        ));

      default:
        return filteredAccomodations.map((accomodation) => (
          <DraggableCardView
            key={"accomodation-" + accomodation.id}
            artifactId={accomodation.id}
            containerStyle={sideDataDragContainerStyle()}
            duration={1}
            shwoCaseClass={draggableStyle.showcaseSideData}
            source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
            getDraggableStyle={getDraggableAccomodationSideDataStyle}
            disappearAnim={
              accomodation.used ? "" : draggableStyles.sideDataDisappearAnim
            }
            artifactType={EArtifact.Accomodation}
            getFinalDestination={getFinalDestinationInAccomodationDZ}
            editArtifact={() =>
              openArtifactEditor({
                type: EArtifact.Accomodation,
                artifact: accomodation,
              })
            }
          >
            {(onDeleteFromPlanning, onDelete, isDragged) => (
              <ArtifactTemplate
                artifact={accomodation}
                isDragged={isDragged}
                onDeleteFromPlanning={onDeleteFromPlanning}
                onDelete={onDelete}
                artifactColor={accomodationColor}
                artifactSecColor={accomodationSecColor}
                artifactIcon={<AccomodationIcon color={defaultWhite} />}
              >
                <AccomodationDataCard accomodation={accomodation} />
              </ArtifactTemplate>
            )}
          </DraggableCardView>
        ));
    }
  }, [
    currentArtifactType,
    filteredActivities,
    filteredAccomodations,
    filteredTransports,
    openArtifactEditor,
  ]);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isEditorOpen) {
      setMarginTop((prevState) => {
        const marginMax = Math.max(
          0,
          sideDataRef.current!.clientHeight -
            sideDataRef.current!.parentElement!.parentElement!.clientHeight +
            sideDataTop
        );
        const tempValue = prevState - 150 * Math.sign(event.deltaY); //150 is the arbitrary choosen step
        const newMarginTop = Math.max(-marginMax, Math.min(0, tempValue));

        return newMarginTop;
      });
    }
  };

  return (
    <div className={styles.sideDataContainer} onWheel={onWheel}>
      <SideDataHeader
        onChange={(menu) => setCurrentArtifactType(menu)}
        setUsedFilter={(used) => setUsedFilter(used)}
      />
      <div className={styles.scrollContainer} style={{ marginTop: marginTop }}>
        <div ref={sideDataRef} className={styles.subContainer}>
          {currentArtifacts}
        </div>
      </div>
      <Fab
        onClick={() => openArtifactEditor(null)}
        color="primary"
        size="small"
        sx={{ position: "absolute", bottom: "10px", right: "10px" }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
