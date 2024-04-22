import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import { EEventStatus } from "../Models/EEventStatus";

export const ArtifactStatusOptions = {
  [EEventStatus.none]: {
    color: "#801717bd",
    secColor: "#430c0c",
    text: "Non réservé",
    icon: (color?: string) => (
      <EventBusyRoundedIcon
        sx={{ fontSize: "15px", color: color ?? "#801717bd" }}
      />
    ),
  },
  [EEventStatus.reserved]: {
    color: "#146ab9bd",
    secColor: "#0c365d",
    text: "Réservé",
    icon: (color?: string) => (
      <EventAvailableRoundedIcon
        sx={{ fontSize: "15px", color: color ?? "#146ab9bd" }}
      />
    ),
  },
  [EEventStatus.paid]: {
    color: "#39a43dbd",
    secColor: "#18491a",
    text: "Payé",
    icon: (color?: string) => (
      <CreditScoreRoundedIcon
        sx={{ fontSize: "15px", color: color ?? "#39a43dbd" }}
      />
    ),
  },
};
