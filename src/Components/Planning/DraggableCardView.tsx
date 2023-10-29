import React, {
  CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./DraggableCardView.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteActivity,
  selectActivities,
  setUsedActivities,
} from "../../features/Redux/activitiesSlice";
import {
  addArtifactPlanning,
  deleteArtifactPlanning,
  insertArtifactPlanning,
  moveArtifactPlanning,
  selectPlanningArtifacts,
  selectPlanningId,
  setArtifactIsDragged,
  updateArtifactPlanning,
} from "../../features/Redux/planningSlice";
import { SIDE_DATA_COL_ID } from "./SideData/SideData";
import { EArtifact } from "../../Models/EArtifacts";
import {
  deleteTransport,
  selectTransports,
  setUsedTransports,
} from "../../features/Redux/transportsSlice";
import {
  deleteAccomodation,
  setUsedAccomodations,
} from "../../features/Redux/accomodationsSlice";
import { defaultWhite, primaryColor } from "../../style/cssGlobalStyle";
import { GRID_CONTAINER } from "./Calendar/CalendarView";
import { Button, ButtonBase, Popover } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export type TDroppableInfo = { colId: string; timeIndex: number };
export type TDnDEvent = {
  source: TDroppableInfo;
  destination: TDroppableInfo;
};

type TDraggableProps = {
  children: (
    onDeleteFromPlanning: () => void,
    onDelete: () => void,
    isHovered: boolean,
    isDragged?: boolean
  ) => JSX.Element | JSX.Element[];
  PAId?: number;
  artifactId: number;
  duration: number;
  containerStyle: CSSProperties;
  source: TDroppableInfo;
  getDraggableStyle: (
    x: number,
    y: number,
    deltaMousePosition: { x: number; y: number },
    dragContainerCoord: { x: number; y: number },
    duration: number
  ) => CSSProperties;
  shwoCaseClass?: string;
  disappearAnim: string;
  artifactType: EArtifact;
  getFinalDestination(
    x: number,
    y: number,
    allowSideData: boolean
  ): [string, number];
  editArtifact: () => void;
  duplicateArtifact: () => void;
};

let scrollInterval: NodeJS.Timeout | null = null;

function DraggableCardView({
  PAId, //Ce n'est pas écrit paid en anglais, c'est planning artifact id
  children,
  artifactId,
  duration,
  containerStyle,
  source,
  getDraggableStyle,
  shwoCaseClass,
  disappearAnim,
  artifactType,
  getFinalDestination,
  editArtifact,
  duplicateArtifact,
}: TDraggableProps) {
  const dispatch = useAppDispatch();
  const planningId = useAppSelector(selectPlanningId)!;
  const planningArtifacts = useAppSelector(selectPlanningArtifacts);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);

  const draggableRef = useRef<HTMLDivElement>(null);
  const [deltaMousePosition, setDeltaMousePosition] = useState({ x: 0, y: 0 });
  const [isDragged, setIsDragged] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties | undefined>();
  const [willDisappear, setWillDisappear] = useState(false);
  const [willBeDeletedFromPlanning, setWillBeDeletedFromPlanning] =
    useState(false);
  const [usedWillDisappear, setUsedWillDisappear] = useState(false);
  const [willBeDeleted, setWillBeDeleted] = useState(false);

  const [destination, setDestination] = useState<TDroppableInfo>(source);
  const [isHovered, setIsHovered] = useState(false);
  const [openPopover, setOpenPopover] = useState<
    undefined | { top: number; left: number }
  >(undefined);

  const containerAnimation = useMemo(() => {
    if (willDisappear || willBeDeleted) {
      return `${disappearAnim} 300ms ease-out forwards`;
    } else if (disappearAnim === styles.calendarDisappear) {
      return "none";
    } else {
      return `300ms ease-out ${styles.sideDataAppearAnim}`;
    }
  }, [willDisappear, willBeDeleted, disappearAnim]);

  const ghostAnimation = useMemo(() => {
    if (usedWillDisappear) {
      return `${styles.usedDisappearAnim} 300ms ease-out forwards`;
    } else if (willDisappear) {
      return `${styles.ghostDisappearAnim} 300ms ease-out forwards`;
    } else {
      return "none";
    }
  }, [usedWillDisappear, willDisappear]);

  const handleAutomaticScroll = useCallback(
    (mouseY: number) => {
      const gridContainer = document.getElementById(GRID_CONTAINER)!;
      const { top, bottom } = gridContainer.getBoundingClientRect();
      if (
        artifactType !== EArtifact.Accomodation &&
        disappearAnim === styles.calendarDisappear &&
        !scrollInterval
      ) {
        if (mouseY - top <= 20) {
          scrollInterval = setInterval(() => {
            gridContainer.scrollTop -= 10;
          }, 10);
        } else if (mouseY >= bottom - 20) {
          scrollInterval = setInterval(() => {
            gridContainer.scrollTop += 10;
          }, 10);
        }
      } else if (scrollInterval && mouseY - top > 20 && mouseY < bottom - 20) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    },
    [artifactType, disappearAnim]
  );

  const onDragEnd = useCallback(
    (event: TDnDEvent) => {
      const { source, destination } = event;
      if (
        source.colId !== destination.colId ||
        source.timeIndex !== destination.timeIndex
      ) {
        if (PAId) {
          const date = destination.colId;
          const timeIndex = destination.timeIndex;
          const updatedPA = {
            id: PAId,
            id_planning: planningId,
            artifactId,
            date,
            timeIndex,
            artifactType,
          };
          dispatch(moveArtifactPlanning(updatedPA));
          dispatch(updateArtifactPlanning(updatedPA));
        } else {
          const date = destination.colId;
          const timeIndex = destination.timeIndex;

          const newPA = {
            id: 0,
            id_planning: planningId,
            artifactId,
            date,
            timeIndex,
            artifactType,
          };
          dispatch(addArtifactPlanning(newPA));
          dispatch(insertArtifactPlanning(newPA));
        }
        setUsedWillDisappear(false);
        setStyle({ top: 0, left: 0, transition: "0s" });
      }
    },
    [artifactType, PAId, artifactId, planningId, dispatch]
  );

  const checkCollision = useCallback(
    (colId: string, timeIndex: number) => {
      if (artifactType === EArtifact.Accomodation) {
        return planningArtifacts
          .filter((PA) => PA.artifactType === EArtifact.Accomodation)
          .some((PA) => PA.id !== PAId && PA.date === colId);
      } else {
        return planningArtifacts
          .filter((PA) => PA.artifactType !== EArtifact.Accomodation)
          .some((PA) => {
            if (PA.id === PAId) {
              return false;
            }
            let currentDuration = 1;

            if (PA.artifactType === EArtifact.Activity) {
              currentDuration = activities.find(
                (activity) => activity.id === PA.artifactId
              )!.duration;
            } else {
              currentDuration = transports.find(
                (transport) => transport.id === PA.artifactId
              )!.duration;
            }
            if (PA.date === colId) {
              //SAME DAY
              if (
                PA.timeIndex <= timeIndex &&
                PA.timeIndex + currentDuration > timeIndex
              ) {
                return true;
              } else if (
                timeIndex <= PA.timeIndex &&
                timeIndex + duration > PA.timeIndex
              ) {
                return true;
              }
            }
            return false;
          });
      }
    },
    [planningArtifacts, activities, transports, artifactType, duration, PAId]
  );

  const onMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (event.button === 0) {
      setMouseDown(true);
      setDeltaMousePosition({
        x: event.clientX - draggableRef.current!.getBoundingClientRect().left,
        y: event.clientY - draggableRef.current!.getBoundingClientRect().top,
      });
    } else if (event.button === 2) {
      setOpenPopover({ left: event.clientX, top: event.clientY });
    }
  };

  const mouseMoveListener = useCallback(
    (event: MouseEvent) => {
      if (mouseDown) {
        setIsDragged(true);

        dispatch(setArtifactIsDragged(artifactType));
        const currentStyle = getDraggableStyle(
          event.clientX,
          event.clientY,
          deltaMousePosition,
          {
            x: draggableRef.current!.offsetLeft,
            y: draggableRef.current!.offsetTop,
          },
          duration
        );
        setStyle(currentStyle);
        handleAutomaticScroll(event.clientY);
      }
    },
    [
      mouseDown,
      deltaMousePosition,
      duration,
      getDraggableStyle,
      artifactType,
      dispatch,
      handleAutomaticScroll,
    ]
  );

  const mouseUpListener = useCallback(
    (event: MouseEvent) => {
      if (isDragged) {
        dispatch(setArtifactIsDragged(null));
        draggableRef.current!.style.cursor = "pointer";
        setIsDragged(false);
        const [colId, timeIndex] = getFinalDestination(
          event.clientX,
          event.clientY,
          source.colId === SIDE_DATA_COL_ID
        );

        if (
          colId !== SIDE_DATA_COL_ID &&
          (colId !== source.colId || timeIndex !== source.timeIndex) &&
          !checkCollision(colId, timeIndex)
        ) {
          setStyle((prevState) => {
            return {
              ...prevState,
              boxShadow: "none",
              transform: "scale(1)",
              borderRadius: "5px",
              backgroundColor: defaultWhite,
            };
          });
          if (disappearAnim === "" && source.colId === SIDE_DATA_COL_ID) {
            setUsedWillDisappear(true);
          } else {
            setWillDisappear(true);
          }
          setDestination({ colId, timeIndex });
        } else {
          setStyle({ top: 0, left: 0 });
        }

        clearInterval(scrollInterval!);
        scrollInterval = null;
      }
      if (mouseDown) {
        setMouseDown(false);
        if (!isDragged) {
          editArtifact();
        }
      }
    },
    [
      isDragged,
      mouseDown,
      source,
      disappearAnim,
      getFinalDestination,
      dispatch,
      checkCollision,
      editArtifact,
    ]
  );

  const onAnimationEnd = (event: React.AnimationEvent) => {
    if (
      event.animationName === disappearAnim ||
      event.animationName === styles.usedDisappearAnim
    ) {
      if (
        source.colId === SIDE_DATA_COL_ID &&
        destination.colId !== SIDE_DATA_COL_ID &&
        event.animationName !== styles.usedDisappearAnim
      ) {
        switch (artifactType) {
          case EArtifact.Activity:
            dispatch(setUsedActivities(artifactId));
            break;
          case EArtifact.Transport:
            dispatch(setUsedTransports(artifactId));
            break;
          default:
            dispatch(setUsedAccomodations(artifactId));
            break;
        }
      }
      onDragEnd({
        destination,
        source,
      });
    }
  };

  const onDeleteAnimationEnd = (event: React.AnimationEvent) => {
    if (event.animationName === styles.ghostDisappearAnim) {
      if (PAId) {
        dispatch(deleteArtifactPlanning(PAId));
        if (
          planningArtifacts.filter((PA) => PA.artifactId === artifactId)
            .length === 1
        ) {
          switch (artifactType) {
            case EArtifact.Activity:
              dispatch(setUsedActivities(artifactId));

              break;
            case EArtifact.Transport:
              dispatch(setUsedTransports(artifactId));
              break;

            default:
              dispatch(setUsedAccomodations(artifactId));
              break;
          }
        }
      } else {
        switch (artifactType) {
          case EArtifact.Activity:
            dispatch(deleteActivity(artifactId));
            break;
          case EArtifact.Transport:
            dispatch(deleteTransport(artifactId));
            break;
          default:
            dispatch(deleteAccomodation(artifactId));
            break;
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", mouseMoveListener);

    return () => {
      window.removeEventListener("mousemove", mouseMoveListener);
    };
  }, [mouseMoveListener]);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpListener);
    return () => {
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, [mouseUpListener]);

  return (
    <div
      ref={draggableRef}
      className={styles.draggableContainer}
      style={{
        ...containerStyle,
        animation: containerAnimation,
      }}
      onAnimationEnd={onAnimationEnd} //is also triggered when child animation ends
    >
      <Popover
        open={openPopover !== undefined}
        anchorReference="anchorPosition"
        anchorPosition={openPopover}
        onClose={() => setOpenPopover(undefined)}
      >
        <Button
          startIcon={<ContentCopyIcon />}
          size="small"
          variant="contained"
          onClick={() => {
            duplicateArtifact();
            setOpenPopover(undefined);
          }}
        >
          Dupliquer
        </Button>
      </Popover>
      <div
        className={`${styles.ghost} ${shwoCaseClass}`}
        style={{
          position: "initial",
          display:
            isDragged || willDisappear || usedWillDisappear ? "" : "none",
          animation: ghostAnimation,
        }}
      >
        {children(
          () => {},
          () => {},
          usedWillDisappear
        )}
      </div>
      <div
        style={{
          height: style?.height,
          width: style?.width,
          top: style?.top,
          left: style?.left,
          borderRadius: style?.borderRadius,
        }}
        className={styles.shadowPosition}
      />
      <div
        style={style}
        className={`${styles.showcase} ${shwoCaseClass} ${
          (willBeDeletedFromPlanning || willBeDeleted) && styles.deleteAnim
        }`}
        onAnimationEnd={onDeleteAnimationEnd}
      >
        <ButtonBase
          sx={{
            position: "absolute",
            height: "100%",
            width: "100%",
            color: primaryColor,
            zIndex: 1,
            cursor: isDragged ? "grabbing" : "pointer",
            borderRadius: "5px",
          }}
          onMouseDown={onMouseDown}
          onMouseLeave={() => setIsHovered(false)}
          onMouseEnter={() => setIsHovered(true)}
        />
        {children(
          () => setWillBeDeletedFromPlanning(true),
          () => setWillBeDeleted(true),
          isHovered,
          isDragged || willDisappear || usedWillDisappear
        )}
      </div>
    </div>
  );
}

export default memo(DraggableCardView);
