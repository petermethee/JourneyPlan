import { IconButton, Slider, Tab, Tabs } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ActivityIcon from "../Shared/ActivityIcon";
import TransportIcon from "../Shared/TransportIcon";
import AccomodationIcon from "../Shared/AccomodationIcon";
import {
  accomodationSecColor,
  activitySecColor,
  defaultWhite,
  transportSecColor,
} from "../../style/cssGlobalStyle";
import styles from "./AddArtifacts.module.css";
import { EArtifact } from "../../Models/EArtifacts";
import SwipeableViews from "react-swipeable-views";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { AddActivity } from "./AddActivity";
import { AddTransport } from "./AddTransport";
import { AddAccomodation } from "./AddAccomodation";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import IAccomodation from "../../Models/IAccomodation";
import IActivity from "../../Models/IActivity";
import ITransport from "../../Models/ITransport";
import { TArtifactEditor } from "../Planning/Planning";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useResizeDetector } from "react-resize-detector";
import { CSSTransition } from "react-transition-group";
import "./TransitionPopup.css";

export enum ESavingStatus {
  enabled = 0,
  disabled = 1,
  loading = 2,
}
export default function AddArtifacts({
  setOpen,
  artifactToEdit,
  openModal,
}: {
  artifactToEdit: TArtifactEditor;
  setOpen: (open: boolean) => void;
  openModal: boolean;
}) {
  const addActivityRef = useRef<{
    edit: (artifactType: EArtifact) => void;
    save: (artifactType: EArtifact) => void;
  }>();
  const addTransportRef = useRef<{
    edit: (artifactType: EArtifact) => void;
    save: (artifactType: EArtifact) => void;
  }>();
  const addAccomodationRef = useRef<{
    edit: (artifactType: EArtifact) => void;
    save: (artifactType: EArtifact) => void;
  }>();

  const id_trip = useAppSelector(selectCurrentTrip)?.id;

  const [saving, setSaving] = useState<ESavingStatus>(ESavingStatus.disabled);
  const [opacity, setOpacity] = useState(100);
  const [tab, setTab] = useState(artifactToEdit.type);

  const tabColor = useMemo(
    () =>
      tab === EArtifact.Activity
        ? activitySecColor
        : tab === EArtifact.Accomodation
        ? accomodationSecColor
        : transportSecColor,
    [tab]
  );
  const {
    width: popupWidth,
    height: popupHeight,
    ref: popupRef,
  } = useResizeDetector();

  const bounds = useMemo(() => {
    return {
      top: -((window.innerHeight - (popupHeight ?? 0)) / 2),
      bottom:
        window.innerHeight -
        (window.innerHeight - (popupHeight ?? 0)) / 2 -
        (popupHeight ?? 0),
      left: -((window.innerWidth - (popupWidth ?? 0)) / 2),
      right:
        window.innerWidth -
        (window.innerWidth - (popupWidth ?? 0)) / 2 -
        (popupWidth ?? 0),
    };
  }, [popupWidth, popupHeight]);

  const handleSave = (edit: boolean) => {
    setSaving(ESavingStatus.loading);
    if (edit) {
      addActivityRef.current?.edit(tab);
      addTransportRef.current?.edit(tab);
      addAccomodationRef.current?.edit(tab);
    } else {
      addActivityRef.current?.save(tab);
      addTransportRef.current?.save(tab);
      addAccomodationRef.current?.save(tab);
    }
  };

  useEffect(() => {
    setTab(artifactToEdit.type);
  }, [artifactToEdit.type]);

  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [setOpen]);

  return (
    <div className={styles.containerPopup} ref={popupRef}>
      <CSSTransition
        in={openModal}
        timeout={100}
        classNames={"popupTransitionContent"}
        unmountOnExit
      >
        <Draggable bounds={bounds} handle={`.${styles.dragHandle}`}>
          <div
            className={styles.insidePopUp}
            style={{ opacity: opacity / 100 }}
          >
            <div
              className={styles.dragHandle}
              style={{ backgroundColor: tabColor }}
            >
              <DragIndicator sx={{ color: defaultWhite }} />
              <Slider
                size="small"
                value={opacity}
                max={100}
                min={20}
                onMouseDown={(e) => e.stopPropagation()}
                color="secondary"
                onChange={(e, value) => setOpacity(value as number)}
                sx={{ width: "35%" }}
              />
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
                size="small"
                sx={{
                  color: defaultWhite,
                  margin: "2px",
                  backgroundColor: " #1a1a1a35",
                  "&:hover": { backgroundColor: "#00000048" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <Tabs
              value={tab}
              onChange={(_event, newValue) => setTab(newValue)}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              sx={{
                backgroundColor: tabColor,
                color: "white",
                boxShadow: "0px 0px 10px 0px #000000ff",
                transition: "300ms",
              }}
            >
              <Tab
                icon={<ActivityIcon color="white" />}
                value={EArtifact.Activity}
                label="Activité"
                sx={{ minHeight: "50px" }}
              />
              <Tab
                icon={<TransportIcon color="white" />}
                value={EArtifact.Transport}
                label="Transport"
                sx={{ minHeight: "50px" }}
              />
              <Tab
                icon={<AccomodationIcon color="white" />}
                value={EArtifact.Accomodation}
                label="Logement"
                sx={{ minHeight: "50px" }}
              />
            </Tabs>
            <SwipeableViews
              index={Object.values(EArtifact).indexOf(tab)}
              onChangeIndex={(index) => setTab(Object.values(EArtifact)[index])}
              containerStyle={{
                flex: "100%",
                willChange: "auto !important",
              }}
              style={{ flex: 1 }}
              slideStyle={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {id_trip
                ? [
                    <AddActivity
                      key="activity"
                      id_trip={id_trip}
                      setSaving={setSaving}
                      ref={addActivityRef}
                      activity={
                        artifactToEdit.type === EArtifact.Activity &&
                        artifactToEdit.artifact
                          ? (artifactToEdit.artifact as IActivity)
                          : undefined
                      }
                    />,
                    <AddTransport
                      key="transport"
                      id_trip={id_trip}
                      setSaving={setSaving}
                      ref={addTransportRef}
                      transport={
                        artifactToEdit.type === EArtifact.Transport &&
                        artifactToEdit.artifact
                          ? (artifactToEdit.artifact as ITransport)
                          : undefined
                      }
                    />,
                    <AddAccomodation
                      key="accomodation"
                      id_trip={id_trip}
                      setSaving={setSaving}
                      ref={addAccomodationRef}
                      accomodation={
                        artifactToEdit.type === EArtifact.Accomodation &&
                        artifactToEdit.artifact
                          ? (artifactToEdit.artifact as IAccomodation)
                          : undefined
                      }
                    />,
                  ]
                : []}
            </SwipeableViews>
            <div className={styles.windowBottom}>
              <LoadingButton
                disabled={saving === ESavingStatus.disabled}
                onClick={() =>
                  handleSave(
                    artifactToEdit.type === tab && !!artifactToEdit.artifact
                  )
                }
                loading={saving === ESavingStatus.loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
              >
                {artifactToEdit.type === tab && artifactToEdit.artifact
                  ? "Mettre à jour"
                  : "Ajouter"}
              </LoadingButton>
            </div>
          </div>
        </Draggable>
      </CSSTransition>
    </div>
  );
}
