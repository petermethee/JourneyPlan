import { Grid, MenuItem, TextField } from "@mui/material";
import React, {
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

export const AddTransport = forwardRef(
  (
    {
      setSaving,
      id_trip,
      transport,
    }: {
      setSaving: (savingStatus: ESavingStatus) => void;
      id_trip: number;
      transport?: ITransport;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();

    const initialFormValues = useMemo(() => {
      if (transport) {
        return {
          [TransportsTable.name]: transport.name,
          [TransportsTable.description]: transport.description,
          [TransportsTable.price]: transport.price,
          [TransportsTable.from]: transport.departure,
          [TransportsTable.to]: transport.destination,
          [TransportsTable.vehicule]: transport.vehicule,
        };
      }
      return {
        [TransportsTable.name]: "",
        [TransportsTable.description]: "",
        [TransportsTable.price]: 0,
        [TransportsTable.from]: "",
        [TransportsTable.to]: "",
        [TransportsTable.vehicule]: "",
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
        return (parseInt(min[1]) / 10) * 4;
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
            attachment,
            used: 0,
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
          [name]: name === "price" ? parseInt(value) : value,
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
        formValues.vehicule !== "" &&
        formValues.destination !== "" &&
        formValues.departure !== "" &&
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
            <Grid item xs={8}>
              <TextField
                required
                name={TransportsTable.name}
                fullWidth
                variant="standard"
                label="Titre"
                value={formValues.name}
                onChange={updateForm}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                name={TransportsTable.price}
                fullWidth
                variant="standard"
                label="Prix"
                value={formValues.price}
                onChange={updateForm}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={5}>
              <LocationSearchInput
                required
                name={TransportsTable.from}
                fullWidth
                variant="standard"
                label="De"
                address={formValues.departure}
                setAddress={(address) =>
                  updateForm({
                    target: { value: address, name: TransportsTable.from },
                  } as unknown as any)
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
                setAddress={(address) =>
                  updateForm({
                    target: { value: address, name: TransportsTable.to },
                  } as unknown as any)
                }
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                required
                name={TransportsTable.vehicule}
                fullWidth
                variant="standard"
                label="Véhicule"
                value={formValues.vehicule}
                onChange={updateForm}
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
            <Grid item xs={12}>
              <TextField
                name={TransportsTable.description}
                fullWidth
                variant="standard"
                label="Notes"
                value={formValues.description}
                onChange={updateForm}
                multiline
              />
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
