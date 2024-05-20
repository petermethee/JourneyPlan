import { IconButton, Tab, Tabs, Slider } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActivityIcon from "../Shared/ActivityIcon";
import TransportIcon from "../Shared/TransportIcon";
import AccommodationIcon from "../Shared/AccommodationIcon";
import {
  accommodationSecColor,
  activitySecColor,
  defaultWhite,
  transportSecColor,
} from "../../style/cssGlobalStyle";
import styles from "./AddArtifacts.module.css";
import { EArtifact } from "../../Models/EArtifacts";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import { TArtifactEditor } from "../Planning/Planning";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicator from "@mui/icons-material/DragIndicator";
import { useResizeDetector } from "react-resize-detector";
import SwipeableViews from "./SwipeableViews";

export enum ESavingStatus {
  enabled = 0,
  disabled = 1,
  loading = 2,
}

export const tabs = [
  {
    index: 0,
    value: EArtifact.Activity,
    label: "Activité",
    icon: <ActivityIcon color="white" />,
  },
  {
    index: 1,
    value: EArtifact.Transport,
    label: "Transport",
    icon: <TransportIcon color="white" />,
  },
  {
    index: 2,

    value: EArtifact.Accommodation,
    label: "Logement",
    icon: <AccommodationIcon color="white" />,
  },
];

export type TRefElem = {
  edit: (artifactType: EArtifact) => void;
  save: (artifactType: EArtifact) => void;
};

export default function AddArtifacts({
  setOpen,
  artifactToEdit,
  openModal,
  setArtifactToEdit,
}: {
  artifactToEdit: TArtifactEditor;
  setOpen: (open: boolean) => void;
  openModal: boolean;
  setArtifactToEdit: (artifactEditor: TArtifactEditor) => void;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const addActivityRef = useRef<TRefElem>();
  const addTransportRef = useRef<TRefElem>();
  const addAccommodationRef = useRef<TRefElem>();

  const id_trip = useAppSelector(selectCurrentTrip)?.id;

  const [saving, setSaving] = useState<ESavingStatus>(ESavingStatus.disabled);
  const [opacity, setOpacity] = useState(100);
  const [tab, setTab] = useState(artifactToEdit.type);

  const tabColor = useMemo(
    () =>
      tab === EArtifact.Activity
        ? activitySecColor
        : tab === EArtifact.Accommodation
          ? accommodationSecColor
          : transportSecColor,
    [tab],
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

  const handleSave = useCallback(
    (edit: boolean) => {
      setSaving(ESavingStatus.loading);
      if (edit) {
        addActivityRef.current?.edit(tab);
        addTransportRef.current?.edit(tab);
        addAccommodationRef.current?.edit(tab);
      } else {
        addActivityRef.current?.save(tab);
        addTransportRef.current?.save(tab);
        addAccommodationRef.current?.save(tab);
      }
    },
    [tab],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        saving === ESavingStatus.enabled &&
        (event.target as any).tagName === "BODY"
      ) {
        handleSave(artifactToEdit.type === tab && !!artifactToEdit.artifact);
      }
    },
    [artifactToEdit, tab, handleSave, saving],
  );

  useEffect(() => {
    setTab(artifactToEdit.type);
  }, [artifactToEdit]);

  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [setOpen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.containerPopup} ref={popupRef}>
      <div
        className={`${styles.fade} ${openModal ? styles.fadeIn : styles.fadeOut}`}
      >
        <Draggable
          nodeRef={nodeRef}
          bounds={bounds}
          handle={`.${styles.dragHandle}`}
        >
          <div
            className={styles.insidePopUp}
            style={{ opacity: opacity / 100 }}
            ref={nodeRef}
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
                onChange={(_e, value) => setOpacity(value as number)}
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
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  icon={tab.icon}
                  value={tab.value}
                  label={tab.label}
                  sx={{ minHeight: "50px" }}
                />
              ))}
            </Tabs>

            <SwipeableViews
              addAccommodationRef={addAccommodationRef}
              addActivityRef={addActivityRef}
              addTransportRef={addTransportRef}
              artifactToEdit={artifactToEdit}
              id_trip={id_trip}
              setArtifactToEdit={setArtifactToEdit}
              setSaving={setSaving}
              tab={tab}
            />
            <div className={styles.windowBottom}>
              <LoadingButton
                disabled={saving !== ESavingStatus.enabled}
                onClick={() =>
                  handleSave(
                    artifactToEdit.type === tab && !!artifactToEdit.artifact,
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
              <LoadingButton
                disabled={saving !== ESavingStatus.enabled}
                onClick={() => {
                  handleSave(
                    artifactToEdit.type === tab && !!artifactToEdit.artifact,
                  );
                  setOpen(false);
                }}
                loading={saving === ESavingStatus.loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
              >
                {artifactToEdit.type === tab && artifactToEdit.artifact
                  ? "Mettre à jour"
                  : "Ajouter"}{" "}
                Et quitter
              </LoadingButton>
            </div>
          </div>
        </Draggable>
      </div>
    </div>
  );
}
