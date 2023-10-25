import { AccomodationsTable } from "../Models/DataBaseModel";
import SoupKitchenRoundedIcon from "@mui/icons-material/SoupKitchenRounded";
import FreeBreakfastRoundedIcon from "@mui/icons-material/FreeBreakfastRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";

export const meals = {
  [AccomodationsTable.breakfast]: {
    text: "Petit Déj",
    icon: (color?: string) => (
      <FreeBreakfastRoundedIcon
        sx={{ fontSize: "14px", color: color ?? "#ffffff" }}
      />
    ),
  },
  [AccomodationsTable.lunch]: {
    text: "Déjeuner",
    icon: (color?: string) => (
      <RestaurantRoundedIcon
        sx={{ fontSize: "14px", color: color ?? "#ffffff" }}
      />
    ),
  },
  [AccomodationsTable.dinner]: {
    text: "Dinner",
    icon: (color?: string) => (
      <SoupKitchenRoundedIcon
        sx={{ fontSize: "14px", color: color ?? "#ffffff" }}
      />
    ),
  },
};
