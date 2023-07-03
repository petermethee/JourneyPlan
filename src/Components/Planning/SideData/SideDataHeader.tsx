import React, { useEffect, useRef, useState } from "react";

import styles from "./SideDataHeader.module.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Button, Switch } from "@mui/material";
import { ERouterPathes } from "../../../Helper/ERouterPathes";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";
import { setSideDataTop } from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { EArtifact } from "../../../Models/EArtifacts";
import ActivityIcon from "../../Shared/ActivityIcon";
import { primaryColor } from "../../../style/cssGlobalStyle";
import TransportIcon from "../../Shared/TransportIcon";
import AccomodationIcon from "../../Shared/AccomodationIcon";

export default function SideDataHeader({
  onChange,
  setUsedFilter,
}: {
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
        <span>
          Utilisés
          <Switch
            size="small"
            onClick={(event: any) =>
              setUsedFilter(event.target.checked ? 1 : 0)
            }
          />
        </span>
      </div>
      <Tabs value={value} onChange={handleChange} sx={{ width: "100%" }}>
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
    </div>
  );
}
