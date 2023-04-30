import React, { useEffect, useRef, useState } from "react";

import styles from "./SideDataHeader.module.css";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, Switch } from "@mui/material";
import { ERouterPathes } from "../../../Helper/ERouterPathes";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import { setSideDataTop } from "../../../DnDCustomLib/CalendarDimensionsHelper";

export enum EArtifacts {
  Activities = "Activities",
  Transports = "Transports",
  Accomodation = "Accomodation",
}
export default function SideDataHeader({
  onChange,
}: {
  onChange: (menu: EArtifacts) => void;
}) {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<EArtifacts>(EArtifacts.Activities);
  const handleChange = (event: React.SyntheticEvent, menu: EArtifacts) => {
    setValue(menu);
    onChange(menu);
  };

  useEffect(() => {
    setSideDataTop(headerRef.current!.getBoundingClientRect().height);
  }, []);

  return (
    <div className={styles.container} ref={headerRef}>
      <div className={styles.topToolContainer}>
        <Button
          onClick={() => navigate(ERouterPathes.home)}
          startIcon={<HomeRoundedIcon />}
          variant="outlined"
        >
          Home
        </Button>
        <span>
          Utilisés
          <Switch size="small" />
        </span>
      </div>
      <Tabs value={value} onChange={handleChange} sx={{ width: "100%" }}>
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<LandscapeRoundedIcon />}
          value={EArtifacts.Activities}
        />
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<TrainRoundedIcon />}
          value={EArtifacts.Transports}
        />
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<HotelRoundedIcon />}
          value={EArtifacts.Accomodation}
        />
      </Tabs>
    </div>
  );
}
