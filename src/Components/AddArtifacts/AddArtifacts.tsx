import { Tab, Tabs } from "@mui/material";
import React, { useRef, useState } from "react";
import ActivityIcon from "../Shared/ActivityIcon";
import TransportIcon from "../Shared/TransportIcon";
import AccomodationIcon from "../Shared/AccomodationIcon";
import {
  accomodationSecColor,
  activitySecColor,
  transportSecColor,
} from "../../style/cssGlobalStyle";
import styles from "./AddArtifacts.module.css";
import { EArtifact } from "../../Models/EArtifacts";
import SwipeableViews from "react-swipeable-views";
import { CSSTransition } from "react-transition-group";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";

import "./TransitionPopup.css";
import { AddActivity } from "./AddActivity";
import { AddTransport } from "./AddTransport";
import { AddAccomodation } from "./AddAccomodation";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";

export enum ESavingStatus {
  enabled = 0,
  disabled = 1,
  loading = 2,
}

export default function AddArtifacts({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const addActivityRef = useRef<{ save: (child: EArtifact) => void }>();
  const addTransportRef = useRef<{ save: (child: EArtifact) => void }>();
  const addAccomodationRef = useRef<{ save: (child: EArtifact) => void }>();

  const id_trip = useAppSelector(selectCurrentTrip)?.id;

  const [saving, setSaving] = useState<ESavingStatus>(ESavingStatus.disabled);

  const [tab, setTab] = useState(EArtifact.Activity);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget === e.target) {
      setOpen(false);
    }
  };

  const handleSave = () => {
    addActivityRef.current!.save(tab);
    addTransportRef.current!.save(tab);
    addAccomodationRef.current!.save(tab);
  };

  return (
    <>
      <CSSTransition
        in={open}
        timeout={300}
        classNames={"popupTransitionBg"}
        unmountOnExit
      >
        <div className={styles.popupBg} />
      </CSSTransition>
      <CSSTransition
        in={open}
        timeout={300}
        classNames={"popupTransitionContent"}
        unmountOnExit
      >
        <div className={styles.popup} onMouseDown={handleClick}>
          <div className={styles.insidePopUp}>
            <Tabs
              value={tab}
              onChange={(_event, newValue) => setTab(newValue)}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              sx={{
                backgroundColor:
                  tab === EArtifact.Activity
                    ? activitySecColor
                    : tab === EArtifact.Accomodation
                    ? accomodationSecColor
                    : transportSecColor,
                color: "white",
                boxShadow: "0px 0px 10px 0px #000000ff",
                transition: "300ms",
              }}
            >
              <Tab
                icon={<ActivityIcon color="white" />}
                value={EArtifact.Activity}
                label="Activité"
              />
              <Tab
                icon={<TransportIcon color="white" />}
                value={EArtifact.Transport}
                label="Transport"
              />
              <Tab
                icon={<AccomodationIcon color="white" />}
                value={EArtifact.Accomodation}
                label="Logement"
              />
            </Tabs>
            <SwipeableViews
              index={Object.values(EArtifact).indexOf(tab)}
              onChangeIndex={(index) => setTab(Object.values(EArtifact)[index])}
              containerStyle={{
                height: "100%",
              }}
              style={{ height: "100%" }}
              slideStyle={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {id_trip
                ? [
                    <AddActivity
                      id_trip={id_trip}
                      setSaving={setSaving}
                      ref={addActivityRef}
                    />,
                    <AddTransport
                      id_trip={id_trip}
                      setSaving={setSaving}
                      ref={addTransportRef}
                    />,
                    <AddAccomodation
                      id_trip={id_trip}
                      setSaving={setSaving}
                      ref={addAccomodationRef}
                    />,
                  ]
                : []}
            </SwipeableViews>

            <div className={styles.windowBottom}>
              <div className={styles.saveTransacBt}>
                <LoadingButton
                  disabled={saving === ESavingStatus.disabled}
                  onClick={handleSave}
                  loading={saving === ESavingStatus.loading}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                >
                  Save
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  );
}
