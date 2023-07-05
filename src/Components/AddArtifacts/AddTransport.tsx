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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import { insertTransport } from "../../features/Redux/transportsSlice";
import { TransportsTable } from "../../Models/DataBaseModel";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import { transportSecColor } from "../../style/cssGlobalStyle";
import ImportAttachmentInput from "./Attachment/ImportAttachmentInput";

export const AddTransport = forwardRef(
  (
    {
      setSaving,
    }: {
      setSaving: (savingStatus: ESavingStatus) => void;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();
    const id_trip = useAppSelector(selectCurrentTrip)!.id;
    const [formValues, setFormValues] = useState<TFormTransport>({
      [TransportsTable.name]: "",
      [TransportsTable.description]: "",
      [TransportsTable.price]: 0,
      [TransportsTable.from]: "",
      [TransportsTable.to]: "",
      [TransportsTable.vehicule]: "",
    });

    const [attachment, setAttachment] = useState<
      { path: string; name: string }[]
    >([]);

    const [dragActive, setDragActive] = useState(false);
    const [hours, setHours] = useState("1");
    const [minutes, setMinutes] = useState(0);

    useImperativeHandle(ref, () => ({
      save(child: EArtifact) {
        if (child === EArtifact.Transport) {
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
          dispatch(insertTransport(newTransport));
        }
      },
    }));

    const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormValues((prevState) => {
        return { ...prevState, [name]: value };
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
        formValues.departure !== ""
      ) {
        setSaving(ESavingStatus.enabled);
      } else {
        setSaving(ESavingStatus.disabled);
      }
    }, [
      formValues.name,
      formValues.vehicule,
      formValues.departure,
      formValues.destination,
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
            <Grid item xs={6}>
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
            <Grid item xs={3}>
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
            <Grid item xs={3}>
              <TextField
                name={TransportsTable.price}
                fullWidth
                variant="standard"
                label="Prix"
                value={formValues.price}
                onChange={updateForm}
                type="number"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                name={TransportsTable.from}
                fullWidth
                variant="standard"
                label="De"
                value={formValues.departure}
                onChange={updateForm}
              />
            </Grid>
            <Grid
              item
              xs={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <EastRoundedIcon
                fontSize="large"
                sx={{ color: transportSecColor }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                name={TransportsTable.to}
                fullWidth
                variant="standard"
                label="Vers"
                value={formValues.destination}
                onChange={updateForm}
              />
            </Grid>
            <Grid item xs={3} flexWrap="nowrap" display="flex" gap={1}>
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
