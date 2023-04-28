import React, { useState } from "react";

import styles from "./SideDataHeader.module.css";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
  const [value, setValue] = useState<EArtifacts>(EArtifacts.Activities);

  const handleChange = (event: React.SyntheticEvent, menu: EArtifacts) => {
    setValue(menu);
    onChange(menu);
  };

  return (
    <div className={styles.container}>
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
