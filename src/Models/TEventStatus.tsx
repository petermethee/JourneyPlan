import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";

export type TEventStatus = EEventStatus;

export enum EEventStatus {
  paid = "Paid",
  reserved = "Reserved",
  none = "none",
}

export const statusOptions = {
  [EEventStatus.none]: {
    color: "#801717bd",
    text: "Non réservé",
    icon: (color?: string) => (
      <EventBusyRoundedIcon
        fontSize="small"
        sx={{ color: color ?? "#801717bd" }}
      />
    ),
  },
  [EEventStatus.reserved]: {
    color: "#146ab9bd",
    text: "Réservé",
    icon: (color?: string) => (
      <EventAvailableRoundedIcon
        fontSize="small"
        sx={{ color: color ?? "#146ab9bd" }}
      />
    ),
  },
  [EEventStatus.paid]: {
    color: "#39a43dbd",
    text: "Payé",
    icon: (color?: string) => (
      <CreditScoreRoundedIcon
        fontSize="small"
        sx={{ color: color ?? "#39a43dbd" }}
      />
    ),
  },
};
