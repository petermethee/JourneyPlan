import { useState } from "react";
import {
  Autocomplete,
  TextField,
  TextFieldProps,
  Tooltip,
} from "@mui/material";

import styles from "./LocationSearchInput.module.css";
import FmdBadRoundedIcon from "@mui/icons-material/FmdBadRounded";
import WhereToVoteRoundedIcon from "@mui/icons-material/WhereToVoteRounded";

let timeout: NodeJS.Timeout;

type TLocation = {
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  county: string;
  lat: number;
  lon: number;
  formatted: string;
};
export default function LocationSearchInput({
  setLocation,
  address,
  isLocationOk,
  ...textFieldProps
}: {
  setLocation: (
    address: string,
    { lat, lng }: { lat: number | null; lng: number | null },
    city?: string,
  ) => void;
  address: string;
  isLocationOk: boolean;
} & TextFieldProps) {
  const [suggestions, setSuggestions] = useState<TLocation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (selectedAddress: TLocation | string) => {
    if (typeof selectedAddress === "string") {
      setLocation(selectedAddress, { lat: null, lng: null });
    } else {
      setLocation(
        selectedAddress.formatted,
        { lat: selectedAddress.lat, lng: selectedAddress.lon },
        selectedAddress.city,
      );
    }
  };

  const handleInputChange = (newAddress: string) => {
    setLocation(newAddress, { lat: null, lng: null });
    setSuggestions([]);

    clearTimeout(timeout);
    if (newAddress !== "") {
      setLoading(true);
      timeout = setTimeout(() => {
        fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${newAddress}&format=json&apiKey=79cc1e4bc4aa4f4cac0f521aa4657a7c`,
        )
          .then((response) => response.json())
          .then((result) => {
            setSuggestions(result.results ?? []);
          })
          .catch((error) => console.error("error", error))
          .finally(() => setLoading(false));
      }, 300);
    }
  };

  return (
    <div className={styles.container}>
      <Autocomplete
        fullWidth
        autoComplete
        size="small"
        freeSolo
        options={suggestions.map((suggestion) => suggestion)}
        renderInput={(params) => <TextField {...textFieldProps} {...params} />}
        onInputChange={(_e, newInputValue) => handleInputChange(newInputValue)}
        onChange={(_event, newValue) => {
          handleSelect(newValue ?? "");
        }}
        value={address}
        filterOptions={(x) => x}
        getOptionLabel={(suggestion) =>
          (suggestion as TLocation).formatted ?? (suggestion as string)
        }
        loading={loading}
      />

      <div className={styles.iconContainer}>
        {isLocationOk ? (
          <Tooltip title={`Localisation : ${address}`}>
            <WhereToVoteRoundedIcon color="primary" />
          </Tooltip>
        ) : (
          <Tooltip title="Localisation non valide">
            <FmdBadRoundedIcon color="error" />
          </Tooltip>
        )}
      </div>
    </div>
  );
}
