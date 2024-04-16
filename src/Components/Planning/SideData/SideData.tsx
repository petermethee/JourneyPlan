import styles from "./SideData.module.css";
import draggableStyle from "../DraggableCardView.module.css";

import draggableStyles from "../../Planning/DraggableCardView.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getDraggableAccomodationSideDataStyle,
  getDraggableSideDataStyle,
  getFinalDestination,
  getFinalDestinationInAccomodationDZ,
  sideDataTop,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { sideDataDragContainerStyle } from "../../../DnDCustomLib/DraggableCSS";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  insertActivity,
  selectActivities,
} from "../../../features/Redux/activitiesSlice";
import DraggableCardView from "../DraggableCardView";
import SideDataHeader from "./SideDataHeader";
import {
  insertTransport,
  selectTransports,
} from "../../../features/Redux/transportsSlice";
import {
  insertAccomodation,
  selectAccomodations,
} from "../../../features/Redux/accommodationsSlice";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActivityDataCard from "../ArtifactsDataCard/ActivityDataCard";
import { EArtifact } from "../../../Models/EArtifacts";
import TransportDataCard from "../ArtifactsDataCard/TransportDataCard";
import AccomodationDataCard from "../ArtifactsDataCard/AccommodationDataCard";
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
import AccomodationIcon from "../../Shared/AccommodationIcon";
import { TArtifactEditor } from "../Planning";
import { selectArtifactIsDragged } from "../../../features/Redux/planningSlice";

export const SIDE_DATA_COL_ID = "SIDE_DATA_COL_ID";

export default function SideData({
  openArtifactEditor,
}: {
  openArtifactEditor: (artifactEditor: TArtifactEditor) => void;
}) {
  const dispatch = useAppDispatch();
  const sideDataRef = useRef<HTMLDivElement>(null);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);
  const isDragged = useAppSelector(selectArtifactIsDragged);

  const [usedFilter, setUsedFilter] = useState<boolean | "all">(false);
  const [marginTop, setMarginTop] = useState(0);
  const [currentArtifactType, setCurrentArtifactType] = useState(
    EArtifact.Activity
  );

  const filteredActivities = useMemo(() => {
    if (usedFilter === "all") {
      return activities;
    } else {
      return activities.filter((activity) => activity.used === usedFilter);
    }
  }, [activities, usedFilter]);

  const filteredTransports = useMemo(() => {
    if (usedFilter === "all") {
      return transports;
    } else {
      return transports.filter((transport) => transport.used === usedFilter);
    }
  }, [transports, usedFilter]);

  const filteredAccomodations = useMemo(() => {
    if (usedFilter === "all") {
      return accomodations;
    } else {
      return accomodations.filter(
        (accomodation) => accomodation.used === usedFilter
      );
    }
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
            duplicateArtifact={() => dispatch(insertActivity(activity))}
          >
            {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
              <ArtifactTemplate
                artifact={activity}
                isDragged={isDragged}
                onDeleteFromPlanning={onDeleteFromPlanning}
                onDelete={onDelete}
                duration={activity.duration}
                artifactColor={activityColor}
                artifactSecColor={activitySecColor}
                artifactIcon={
                  <ActivityIcon size="small" color={defaultWhite} />
                }
                isHovered={isHovered}
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
            duplicateArtifact={() => dispatch(insertTransport(transport))}
          >
            {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
              <ArtifactTemplate
                artifact={transport}
                isDragged={isDragged}
                onDeleteFromPlanning={onDeleteFromPlanning}
                onDelete={onDelete}
                duration={transport.duration}
                artifactColor={transportColor}
                artifactSecColor={transportSecColor}
                artifactIcon={
                  <TransportIcon size="small" color={defaultWhite} />
                }
                isHovered={isHovered}
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
            duplicateArtifact={() => dispatch(insertAccomodation(accomodation))}
          >
            {(onDeleteFromPlanning, onDelete, isHovered, isDragged) => (
              <ArtifactTemplate
                artifact={accomodation}
                isDragged={isDragged}
                onDeleteFromPlanning={onDeleteFromPlanning}
                onDelete={onDelete}
                artifactColor={accomodationColor}
                artifactSecColor={accomodationSecColor}
                artifactIcon={
                  <AccomodationIcon size="small" color={defaultWhite} />
                }
                isHovered={isHovered}
                isAccomodation
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
    dispatch,
  ]);

  const [usedNumber, setUsedNumber] = useState(0);
  const [unusedNumber, setUnusedNumber] = useState(0);

  useEffect(() => {
    let remainingArtifacts = 0;
    let usedCount = 0;
    switch (currentArtifactType) {
      case EArtifact.Activity:
        usedCount = activities.filter((activity) => activity.used).length;
        remainingArtifacts = activities.length - usedCount;
        break;
      case EArtifact.Accomodation:
        usedCount = accomodations.filter((activity) => activity.used).length;
        remainingArtifacts = accomodations.length - usedCount;
        break;
      default:
        usedCount = transports.filter((transport) => transport.used).length;
        remainingArtifacts = transports.length - usedCount;
        break;
    }
    setUsedNumber(usedCount);
    setUnusedNumber(remainingArtifacts);
  }, [activities, transports, accomodations, currentArtifactType]);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
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
  };

  return (
    <div
      className={styles.sideDataContainer}
      style={{ pointerEvents: isDragged ? "none" : "auto" }}
      onWheel={onWheel}
    >
      <SideDataHeader
        unusedNumber={unusedNumber}
        usedNumber={usedNumber}
        onChange={(menu) => {
          setMarginTop(0);
          setCurrentArtifactType(menu);
        }}
        setUsedFilter={(used) => {
          setMarginTop(0);
          setUsedFilter((prevState) => {
            if (usedNumber === 0) {
              return false;
            } else {
              return prevState === "all"
                ? !used
                : prevState === used
                ? !used
                : "all";
            }
          });
        }}
        usedFilter={usedFilter}
      />

      <div className={styles.scrollContainer} style={{ marginTop: marginTop }}>
        <div ref={sideDataRef} className={styles.subContainer}>
          {currentArtifacts}
        </div>
      </div>
      <Fab
        onClick={() => openArtifactEditor({ type: currentArtifactType })}
        color="primary"
        size="small"
        sx={{ position: "absolute", bottom: "10px", right: "10px" }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
