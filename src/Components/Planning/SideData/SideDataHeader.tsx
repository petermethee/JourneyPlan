import React, { useEffect, useRef, useState } from "react";

import styles from "./SideDataHeader.module.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, Radio } from "@mui/material";
import { ERouterPathes } from "../../../Helper/ERouterPathes";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import { setSideDataTop } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { EArtifact } from "../../../Models/EArtifacts";
import ActivityIcon from "../../Shared/ActivityIcon";
import { primaryColor } from "../../../style/cssGlobalStyle";
import TransportIcon from "../../Shared/TransportIcon";
import AccomodationIcon from "../../Shared/AccomodationIcon";
import NotificationBadge from "../../Shared/NotificationBadge";

export default function SideDataHeader({
  onChange,
  usedNumber,
  unusedNumber,
  setUsedFilter,
  usedFilter,
}: {
  usedFilter: boolean;
  usedNumber: number;
  unusedNumber: number;
  onChange: (menu: EArtifact) => void;
  setUsedFilter: (used: 0 | 1) => void;
}) {
  const navigate = useNavigate();
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
      <div className={styles.topToolContainer}>
        <Button
          onClick={() => navigate(ERouterPathes.home)}
          startIcon={<HomeRoundedIcon />}
          variant="outlined"
        >
          Home
        </Button>
      </div>
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
          icon={<AccomodationIcon color={primaryColor} />}
          value={EArtifact.Accomodation}
        />
      </Tabs>
      <div className={styles.radioContainer}>
        <Button
          size="small"
          variant={usedFilter ? "contained" : "outlined"}
          className={styles.radioContent}
          onClick={() => setUsedFilter(0)}
          sx={{ backgroundColor: !usedFilter ? "white" : "" }}
        >
          <NotificationBadge number={unusedNumber} />

          <Radio
            size="small"
            color="secondary"
            disableRipple
            checked={usedFilter}
            sx={{ padding: 0 }}
          />
          <div>Non Utilisés</div>
        </Button>
        <Button
          size="small"
          variant={usedFilter ? "outlined" : "contained"}
          className={styles.radioContent}
          onClick={() => setUsedFilter(1)}
          disabled={usedNumber === 0}
          sx={{ backgroundColor: usedFilter ? "white" : "" }}
        >
          <NotificationBadge number={usedNumber} />
          <Radio
            size="small"
            color="secondary"
            disableRipple
            checked={!usedFilter}
            sx={{ padding: 0 }}
          />
          <div>Utilisés</div>
        </Button>
      </div>
    </div>
  );
}
