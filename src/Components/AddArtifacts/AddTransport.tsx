import { Grid, MenuItem, TextField } from "@mui/material";
import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import ITransport, { TFormTransport } from "../../Models/ITransport";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./AddArtifacts.module.css";
import AttachmentCard from "./Attachment/AttachmentCard";
import AttachmentDZ from "./Attachment/AttachmentDZ";
import { ESavingStatus } from "./AddArtifacts";
import { EArtifact } from "../../Models/EArtifacts";
import { useAppDispatch } from "../../app/hooks";
import { setSnackbarStatus } from "../../features/Redux/tripSlice";
import {
  insertTransport,
  updateTransport,
} from "../../features/Redux/transportsSlice";
import { TransportsTable } from "../../Models/DataBaseModel";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import { transportSecColor } from "../../style/cssGlobalStyle";
import ImportAttachmentInput from "./Attachment/ImportAttachmentInput";
import IAttachment from "../../Models/IAttachment";
import LocationSearchInput from "./LocationSearchInput";
import { TArtifactEditor } from "../Planning/Planning";
import { EEventStatus } from "../../Models/EEventStatus";
import { ArtifactStatusOptions } from "../../Models/ArtifactStatusOptions";

export const AddTransport = forwardRef(
  (
    {
      setSaving,
      id_trip,
      transport,
      setArtifactToEdit,
    }: {
      setSaving: (savingStatus: ESavingStatus) => void;
      id_trip: number;
      transport?: ITransport;
      setArtifactToEdit: (artifactEditor: TArtifactEditor) => void;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();

    const initialFormValues: TFormTransport = useMemo(() => {
      if (transport) {
        return {
          [TransportsTable.name]: transport.name,
          [TransportsTable.description]: transport.description,
          [TransportsTable.price]: transport.price.toString(),
          [TransportsTable.from]: transport.departure,
          [TransportsTable.to]: transport.destination,
          [TransportsTable.lat_from]: transport.lat_from,
          [TransportsTable.lat_to]: transport.lat_to,
          [TransportsTable.lng_from]: transport.lng_from,
          [TransportsTable.lng_to]: transport.lng_to,
          [TransportsTable.city_from]: transport.city_from,
          [TransportsTable.city_to]: transport.city_to,
          [TransportsTable.status]: transport.status,
        };
      }
      return {
        [TransportsTable.name]: "",
        [TransportsTable.description]: "",
        [TransportsTable.price]: "0",
        [TransportsTable.from]: "",
        [TransportsTable.to]: "",
        [TransportsTable.lat_from]: null,
        [TransportsTable.lat_to]: null,
        [TransportsTable.lng_from]: null,
        [TransportsTable.lng_to]: null,
        [TransportsTable.city_from]: null,
        [TransportsTable.city_to]: null,
        [TransportsTable.status]: EEventStatus.none,
      };
    }, [transport]);

    const [formValues, setFormValues] =
      useState<TFormTransport>(initialFormValues);
    const initialAttachment = useMemo(
      () => (transport ? transport.attachment : []),
      [transport]
    );
    const [attachment, setAttachment] =
      useState<IAttachment[]>(initialAttachment);

    const initialHours = useMemo(
      () => (transport ? transport.duration.toString().split(".")[0] : "1"),
      [transport]
    );
    const [hours, setHours] = useState(initialHours);

    const initMinute = useMemo(() => {
      const min = transport?.duration.toString().split(".");
      if (min && min.length > 1) {
        return (parseInt(min[1]) / 100) * 4;
      }
      return 0;
    }, [transport?.duration]);

    const [minutes, setMinutes] = useState(initMinute);
    const [dragActive, setDragActive] = useState(false);

    const clearInputs = () => {
      setFormValues(initialFormValues);
      setAttachment([]);
      setHours("1");
      setMinutes(0);
    };

    useImperativeHandle(ref, () => ({
      save(artifactType: EArtifact) {
        if (artifactType === EArtifact.Transport) {
          const duration =
            parseInt(hours) + Math.round((minutes / 4) * 100) / 100;

          const newTransport: ITransport = {
            id: 0,
            id_trip,
            duration,
            ...formValues,
            price: parseFloat(formValues.price),
            attachment,
            used: false,
          };
          dispatch(insertTransport(newTransport)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              dispatch(
                setSnackbarStatus({
                  message: "Votre transport a correctement été ajouté",
                  snackBarSeverity: "success",
                })
              );
              setSaving(ESavingStatus.disabled);
              clearInputs();
            } else if (result.meta.requestStatus === "rejected") {
              //no need to set snackbar in case of rejection, handled in globalSlice
              setSaving(ESavingStatus.enabled);
            }
          });
        }
      },
      edit(artifactType: EArtifact) {
        if (artifactType === EArtifact.Transport) {
          const duration =
            parseInt(hours) + Math.round((minutes / 4) * 100) / 100;

          const updatedTransport: ITransport = {
            id: transport!.id,
            id_trip,
            duration,
            ...formValues,
            price: parseFloat(formValues.price),
            attachment,
            used: transport!.used,
          };
          dispatch(updateTransport(updatedTransport)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              dispatch(
                setSnackbarStatus({
                  message: "Le transport a correctement été mis à jour",
                  snackBarSeverity: "success",
                })
              );
              setArtifactToEdit({ type: EArtifact.Transport });
              setSaving(ESavingStatus.disabled);
            } else if (result.meta.requestStatus === "rejected") {
              //no need to set snackbar in case of rejection, handled in globalSlice
              setSaving(ESavingStatus.enabled);
            }
          });
        }
      },
    }));

    const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormValues((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    };

    const isHourValid = useMemo(() => {
      const hourNum = parseInt(hours);
      if (isNaN(hourNum)) {
        return false;
      } else if (hourNum < 0 || hourNum > 23) {
        return false;
      }
      return true;
    }, [hours]);

    useEffect(() => {
      if (
        isHourValid &&
        formValues.name !== "" &&
        formValues.destination !== "" &&
        formValues.departure !== "" &&
        formValues.price !== "" &&
        (JSON.stringify(formValues) !== JSON.stringify(initialFormValues) ||
          initialAttachment.join() !== attachment.join() ||
          initialHours !== hours ||
          initMinute !== minutes)
      ) {
        setSaving(ESavingStatus.enabled);
      } else {
        setSaving(ESavingStatus.disabled);
      }
    }, [
      formValues,
      initialFormValues,
      attachment,
      initialAttachment,
      initMinute,
      initialHours,
      minutes,
      hours,
      isHourValid,
      setSaving,
    ]);

    useEffect(() => {
      setFormValues(initialFormValues);
    }, [initialFormValues]);

    useEffect(() => {
      setAttachment(initialAttachment);
    }, [initialAttachment]);
    useEffect(() => {
      setHours(initialHours);
    }, [initialHours]);

    useEffect(() => {
      setMinutes(initMinute);
    }, [initMinute]);

    return (
      <>
        <div
          className={styles.dropLabel}
          style={{ opacity: dragActive ? 1 : 0 }}
        >
          <DownloadIcon />
          Lâcher le document ici
        </div>

        <div style={{ position: "relative", width: "100%", flex: 1 }}>
          <AttachmentDZ
            setDragActive={setDragActive}
            dragActive={dragActive}
            setAttachment={setAttachment}
          />

          <Grid container spacing={4} padding={4}>
            <Grid item xs={5}>
              <TextField
                required
                name={TransportsTable.name}
                fullWidth
                variant="standard"
                label="Véhicule"
                value={formValues.name}
                onChange={updateForm}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name={TransportsTable.price}
                fullWidth
                variant="standard"
                label="Prix"
                value={formValues.price}
                onChange={(event) => {
                  const re = /^\d*\.?\d{0,2}$/;
                  if (event.target.value === "" || re.test(event.target.value))
                    updateForm(event as ChangeEvent<HTMLInputElement>);
                }}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={4} flexWrap="nowrap" display="flex" gap={1}>
              <TextField
                fullWidth
                variant="standard"
                label="H"
                value={hours}
                type="number"
                InputProps={{ inputProps: { min: 0, max: 23 } }}
                onChange={(event) => setHours(event.target.value)}
                error={!isHourValid}
              />
              <TextField
                select
                fullWidth
                variant="standard"
                label="MIN"
                value={minutes}
                onChange={(event) => setMinutes(parseInt(event.target.value))}
                sx={{ "& .MuiSelect-select": { fontSize: "1.3rem" } }}
              >
                {["00", 15, 30, 45].map((minute, index) => (
                  <MenuItem key={minute} value={index}>
                    {minute}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={5}>
              <LocationSearchInput
                required
                name={TransportsTable.from}
                fullWidth
                variant="standard"
                label="De"
                address={formValues.departure}
                setAddress={(address, { lng, lat }, city) =>
                  setFormValues((prevState) => {
                    return {
                      ...prevState,
                      departure: address,
                      lng_from: lng,
                      lat_from: lat,
                      city_from: city ?? null,
                    };
                  })
                }
                isLocalisationOk={
                  formValues.lat_from !== null && formValues.lng_from !== null
                }
              />
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <EastRoundedIcon
                fontSize="large"
                sx={{ color: transportSecColor }}
              />
            </Grid>
            <Grid item xs={5}>
              <LocationSearchInput
                required
                name={TransportsTable.to}
                fullWidth
                variant="standard"
                label="Vers"
                address={formValues.destination}
                setAddress={(address, { lat, lng }, city) =>
                  setFormValues((prevState) => {
                    return {
                      ...prevState,
                      destination: address,
                      city_to: city ?? null,
                      lat_to: lat,
                      lng_to: lng,
                    };
                  })
                }
                isLocalisationOk={
                  formValues.lat_to !== null && formValues.lng_to !== null
                }
              />
            </Grid>

            <Grid item xs={8}>
              <TextField
                name={TransportsTable.description}
                fullWidth
                variant="standard"
                label="Notes"
                value={formValues.description}
                onChange={updateForm}
                multiline
                inputProps={{ style: { backgroundColor: "#00000010" } }}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                select
                name={TransportsTable.status}
                fullWidth
                variant="standard"
                label="Status"
                value={formValues.status}
                onChange={updateForm}
              >
                {Object.entries(ArtifactStatusOptions).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    <div className={styles.statusContainer}>
                      {val.icon()}
                      <span>{val.text}</span>
                    </div>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item width="100%" display="flex">
              <ImportAttachmentInput setAttachment={setAttachment} />
            </Grid>
            <Grid item xs={12} container gap={1}>
              {attachment.map((PJ) => (
                <Grid key={PJ.path} item>
                  <AttachmentCard
                    imagePath={PJ.path}
                    imageName={PJ.name}
                    onDelete={() =>
                      setAttachment((prevState) =>
                        prevState.filter((newPJ) => newPJ.path !== PJ.path)
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
      </>
    );
  }
);
