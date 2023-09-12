import { useEffect, useRef, useState } from "react";
import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import styles from "./LocationSearchInput.module.css";
import FmdBadRoundedIcon from "@mui/icons-material/FmdBadRounded";
import WhereToVoteRoundedIcon from "@mui/icons-material/WhereToVoteRounded";
export default function LocationSearchInput({
  setAddress,
  address,
  isLocalisationOk,
  ...textFieldProps
}: {
  setAddress: (
    adress: string,
    { lat, lng }: { lat: number | null; lng: number | null },
    city?: string
  ) => void;
  address: string;
  isLocalisationOk: boolean;
} & TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [localisationOk, setLocalisationOk] = useState(isLocalisationOk);

  const handleSelect = (address: string) => {
    geocodeByAddress(address).then(async (results) => {
      const selectedCity = results[0].address_components.find((component) =>
        component.types.includes("locality")
      );
      console.log("selected city", selectedCity);

      const latLng = await getLatLng(results[0]);
      setAddress(address, latLng, selectedCity?.short_name);
      setLocalisationOk(true);
    });
    // .catch((error) => console.error("Error", error));
  };

  useEffect(() => {
    setLocalisationOk(isLocalisationOk);
  }, [isLocalisationOk]);

  return (
    <PlacesAutocomplete
      value={address}
      onChange={(newAddress) => {
        setAddress(newAddress, { lat: null, lng: null });
        setLocalisationOk(false);
      }}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.container}>
          <TextField
            inputRef={ref}
            {...textFieldProps}
            {...getInputProps()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {localisationOk ? (
                    <WhereToVoteRoundedIcon color="primary" />
                  ) : (
                    <FmdBadRoundedIcon color="error" />
                  )}
                </InputAdornment>
              ),
            }}
          />
          <div className={styles.dropdownContainer}>
            {loading && <div>Chargement...</div>}
            {suggestions.map((suggestion, index) => {
              const className = `${styles.suggestion} ${
                suggestion.active && styles.active
              } ${suggestion.description === address && styles.selected}`;

              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                  })}
                  key={index}
                  onClick={(e) => {
                    ref.current!.blur();
                    handleSelect(suggestion.description);
                  }}
                >
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}
