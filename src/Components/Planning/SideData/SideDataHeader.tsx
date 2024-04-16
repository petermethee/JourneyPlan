import React, { useEffect, useRef, useState } from "react";
import styles from "./SideDataHeader.module.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Chip } from "@mui/material";
import { setSideDataTop } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { EArtifact } from "../../../Models/EArtifacts";
import ActivityIcon from "../../Shared/ActivityIcon";
import { primaryColor } from "../../../style/cssGlobalStyle";
import TransportIcon from "../../Shared/TransportIcon";
import AccommodationIcon from "../../Shared/AccommodationIcon";
import NotificationBadge from "../../Shared/NotificationBadge";
import MenuBar from "../../Shared/MenuBar";

export default function SideDataHeader({
  onChange,
  usedNumber,
  unusedNumber,
  setUsedFilter,
  usedFilter,
}: {
  usedFilter: boolean | "all";
  usedNumber: number;
  unusedNumber: number;
  onChange: (menu: EArtifact) => void;
  setUsedFilter: (used: boolean | "all") => void;
}) {
  const headerRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState<EArtifact>(EArtifact.Activity);
  const handleChange = (event: React.SyntheticEvent, menu: EArtifact) => {
    setValue(menu);
    onChange(menu);
  };

  useEffect(() => {
    setSideDataTop(headerRef.current!.getBoundingClientRect().height);
  }, []);

  return (
    <div className={styles.container} ref={headerRef}>
      <MenuBar />
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{ width: "100%" }}
        className={styles.tabs}
      >
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<ActivityIcon color={primaryColor} />}
          value={EArtifact.Activity}
        />
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<TransportIcon color={primaryColor} />}
          value={EArtifact.Transport}
        />
        <Tab
          sx={{
            minWidth: "0px",
            flex: 1,
          }}
          icon={<AccommodationIcon color={primaryColor} />}
          value={EArtifact.Accommodation}
        />
      </Tabs>
      <div className={styles.radioContainer}>
        <Chip
          size="small"
          variant={usedFilter === true ? "outlined" : "filled"}
          className={styles.radioContent}
          onClick={() => setUsedFilter(false)}
          label="Non Utilisés"
          color="primary"
          icon={<NotificationBadge number={unusedNumber} />}
        ></Chip>
        <Chip
          size="small"
          variant={usedFilter === false ? "outlined" : "filled"}
          className={styles.radioContent}
          onClick={() => setUsedFilter(true)}
          disabled={usedNumber === 0}
          color="primary"
          label="Utilisés"
          icon={<NotificationBadge number={usedNumber} />}
        />
      </div>
    </div>
  );
}
