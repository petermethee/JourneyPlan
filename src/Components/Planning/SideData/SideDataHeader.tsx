import React, { useState } from "react";

import styles from "./SideDataHeader.module.css";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
export default function SideDataHeader({
  onChange,
}: {
  onChange: (menu: string) => void;
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
        />
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<TrainRoundedIcon />}
        />
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<HotelRoundedIcon />}
        />
      </Tabs>
    </div>
  );
}
