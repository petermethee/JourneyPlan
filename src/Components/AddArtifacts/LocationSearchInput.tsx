import { TextField, TextFieldProps } from "@mui/material";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import styles from "./LocationSearchInput.module.css";
import { useRef } from "react";

export default function LocationSearchInput({
  setAddress,
  address,
  ...textFieldProps
}: { setAddress: (adress: string) => void; address: string } & TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const handleSelect = (address: string) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setAddress(address);
        console.log("latlng", latLng);
      });
    // .catch((error) => console.error("Error", error));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={(newAddress) => setAddress(newAddress)}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.container}>
          <TextField inputRef={ref} {...textFieldProps} {...getInputProps()} />
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
