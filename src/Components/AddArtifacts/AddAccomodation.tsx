import { Grid, TextField } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import IAccomodation, { TFormAccomodation } from "../../Models/IAccomodation";
import {
  AccomodationsTable,
  TransportsTable,
} from "../../Models/DataBaseModel";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./AddArtifacts.module.css";
import AttachmentCard from "./Attachment/AttachmentCard";
import AttachmentDZ from "./Attachment/AttachmentDZ";
import { ESavingStatus } from "./AddArtifacts";
import { EArtifact } from "../../Models/EArtifacts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { insertAccomodation } from "../../features/Redux/accomodationsSlice";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ImportAttachmentInput from "./Attachment/ImportAttachmentInput";

export const AddAccomodation = forwardRef(
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
    const [formValues, setFormValues] = useState<TFormAccomodation>({
      [AccomodationsTable.name]: "",
      [AccomodationsTable.description]: "",
      [AccomodationsTable.price]: 0,
      [AccomodationsTable.location]: "",
      [AccomodationsTable.checkin]: undefined,
      [AccomodationsTable.checkout]: undefined,
    });

    const [attachment, setAttachment] = useState<
      { path: string; name: string }[]
    >([]);

    const [dragActive, setDragActive] = useState(false);

    useImperativeHandle(ref, () => ({
      save(child: EArtifact) {
        if (child === EArtifact.Accomodation) {
          const newAccomodation: IAccomodation = {
            id: 0,
            id_trip,
            ...formValues,
            attachment,
            used: 0,
          };
          dispatch(insertAccomodation(newAccomodation));
        }
      },
    }));

    const dayJsCheckin = useMemo(() => {
      if (formValues.checkin) {
        const [h, m] = formValues.checkin.split(":");
        const dateTime = dayjs()
          .set("hours", parseInt(h))
          .set("minutes", parseInt(m));
        return dateTime;
      }
      return null;
    }, [formValues.checkin]);

    const dayJsCheckout = useMemo(() => {
      if (formValues.checkout) {
        const [h, m] = formValues.checkout.split(":");
        const dateTime = dayjs()
          .set("hours", parseInt(h))
          .set("minutes", parseInt(m));
        return dateTime;
      }
      return null;
    }, [formValues.checkout]);

    const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormValues((prevState) => {
        return { ...prevState, [name]: value };
      });
    };

    useEffect(() => {
      if (formValues.name !== "" && formValues.location) {
        setSaving(ESavingStatus.enabled);
      } else {
        setSaving(ESavingStatus.disabled);
      }
    }, [formValues.name, formValues.location, setSaving]);

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
            <Grid item xs={9}>
              <TextField
                required
                name={AccomodationsTable.name}
                fullWidth
                variant="standard"
                label="Titre"
                value={formValues.name}
                onChange={updateForm}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                name={AccomodationsTable.price}
                fullWidth
                variant="standard"
                label="Prix"
                value={formValues.price}
                onChange={updateForm}
                type="number"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                name={AccomodationsTable.location}
                fullWidth
                variant="standard"
                label="Localisation"
                value={formValues.location}
                onChange={updateForm}
              />
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  ampm={false}
                  label="Checkin"
                  value={dayJsCheckin}
                  onChange={(newValue) =>
                    setFormValues((prevState) => {
                      return {
                        ...prevState,
                        checkin: newValue
                          ? newValue.hour() + ":" + newValue.minute()
                          : undefined,
                      };
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  ampm={false}
                  label="Checkout"
                  value={dayJsCheckout ?? null}
                  onChange={(newValue) =>
                    setFormValues((prevState) => {
                      return {
                        ...prevState,
                        checkout: newValue
                          ? newValue.hour() + ":" + newValue.minute()
                          : undefined,
                      };
                    })
                  }
                />
              </LocalizationProvider>
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
