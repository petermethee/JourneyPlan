import { Chip, Grid } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import IAccomodation, { TFormAccomodation } from "../../Models/IAccomodation";
import { AccomodationsTable } from "../../Models/DataBaseModel";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./AddArtifacts.module.css";
import AttachmentCard from "./Attachment/AttachmentCard";
import AttachmentDZ from "./Attachment/AttachmentDZ";
import { ESavingStatus } from "./AddArtifacts";
import { EArtifact } from "../../Models/EArtifacts";
import { useAppDispatch } from "../../app/hooks";
import {
  insertAccomodation,
  updateAccomodation,
} from "../../features/Redux/accomodationsSlice";
import { setSnackbarStatus } from "../../features/Redux/tripSlice";
import { MobileTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ImportAttachmentInput from "./Attachment/ImportAttachmentInput";
import IAttachment from "../../Models/IAttachment";
import LocationSearchInput from "./Inputs/LocationSearchInput";
import { TArtifactEditor } from "../Planning/Planning";
import { EEventStatus } from "../../Models/EEventStatus";
import { meals } from "../../Helper/MealsHelper";
import DescriptionInput from "./Inputs/DescriptionInput";
import PriceInput from "./Inputs/PriceInput";
import StatusSelector from "./Inputs/StatusSelector";
import NameInput from "./Inputs/NameInput";

export const AddAccomodation = forwardRef(
  (
    {
      setSaving,
      id_trip,
      accomodation,
      setArtifactToEdit,
      isFocused,
    }: {
      setSaving: (savingStatus: ESavingStatus) => void;
      id_trip: number;
      accomodation?: IAccomodation;
      setArtifactToEdit: (artifactEditor: TArtifactEditor) => void;
      isFocused: boolean;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();

    const initialFormValues: TFormAccomodation = useMemo(() => {
      if (accomodation) {
        return {
          [AccomodationsTable.name]: accomodation.name,
          [AccomodationsTable.description]: accomodation.description,
          [AccomodationsTable.price]: accomodation.price.toString(),
          [AccomodationsTable.location]: accomodation.location,
          [AccomodationsTable.checkin]: accomodation.checkin,
          [AccomodationsTable.checkout]: accomodation.checkout,
          [AccomodationsTable.lat]: accomodation.lat,
          [AccomodationsTable.lng]: accomodation.lng,
          [AccomodationsTable.city]: accomodation.city,
          [AccomodationsTable.status]: accomodation.status,
          [AccomodationsTable.breakfast]: accomodation.breakfast,
          [AccomodationsTable.lunch]: accomodation.lunch,
          [AccomodationsTable.dinner]: accomodation.dinner,
        };
      }
      return {
        [AccomodationsTable.name]: "",
        [AccomodationsTable.description]: "",
        [AccomodationsTable.price]: "0",
        [AccomodationsTable.location]: "",
        [AccomodationsTable.checkin]: "18:00",
        [AccomodationsTable.checkout]: "10:00",
        [AccomodationsTable.lat]: null,
        [AccomodationsTable.lng]: null,
        [AccomodationsTable.city]: null,
        [AccomodationsTable.status]: EEventStatus.none,
        [AccomodationsTable.breakfast]: 0,
        [AccomodationsTable.lunch]: 0,
        [AccomodationsTable.dinner]: 0,
      };
    }, [accomodation]);

    const [formValues, setFormValues] =
      useState<TFormAccomodation>(initialFormValues);

    const initialAttachment = useMemo(
      () => (accomodation ? accomodation.attachment : []),
      [accomodation]
    );
    const [attachment, setAttachment] =
      useState<IAttachment[]>(initialAttachment);

    const [dragActive, setDragActive] = useState(false);

    const clearInputs = () => {
      setFormValues(initialFormValues);
      setAttachment([]);
    };

    useImperativeHandle(ref, () => ({
      save(artifactType: EArtifact) {
        if (artifactType === EArtifact.Accomodation) {
          const newAccomodation: IAccomodation = {
            id: 0,
            id_trip,
            ...formValues,
            price: parseFloat(formValues.price),
            attachment,
            used: false,
          };
          dispatch(insertAccomodation(newAccomodation)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              dispatch(
                setSnackbarStatus({
                  message: "Votre Hébergement a correctement été ajouté",
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
        if (artifactType === EArtifact.Accomodation) {
          const updatedAccomodation: IAccomodation = {
            id: accomodation!.id,
            id_trip,
            ...formValues,
            price: parseFloat(formValues.price),
            attachment,
            used: accomodation!.used,
          };
          dispatch(updateAccomodation(updatedAccomodation)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              dispatch(
                setSnackbarStatus({
                  message: "Le Hébergement a correctement été mis à jour",
                  snackBarSeverity: "success",
                })
              );
              setSaving(ESavingStatus.disabled);
              setArtifactToEdit({ type: EArtifact.Accomodation });
            } else if (result.meta.requestStatus === "rejected") {
              //no need to set snackbar in case of rejection, handled in globalSlice
              setSaving(ESavingStatus.enabled);
            }
          });
        }
      },
    }));

    const dayJsCheckin = useMemo(() => {
      const [h, m] = formValues.checkin.split(":");
      const dateTime = dayjs()
        .set("hours", parseInt(h))
        .set("minutes", parseInt(m));
      return dateTime;
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
        return {
          ...prevState,
          [name]: value,
        };
      });
    };

    useEffect(() => {
      if (isFocused) {
        if (
          (formValues.price !== "" &&
            formValues.name !== "" &&
            formValues.location &&
            JSON.stringify(formValues) !== JSON.stringify(initialFormValues)) ||
          initialAttachment.join() !== attachment.join()
        ) {
          setSaving(ESavingStatus.enabled);
        } else {
          setSaving(ESavingStatus.disabled);
        }
      }
    }, [
      formValues,
      initialFormValues,
      attachment,
      initialAttachment,
      setSaving,
      isFocused,
    ]);

    useEffect(() => {
      setFormValues(initialFormValues);
    }, [initialFormValues]);

    useEffect(() => {
      setAttachment(initialAttachment);
    }, [initialAttachment]);

    return (
      <>
        <div
          className={styles.dropLabel}
          style={{ opacity: dragActive ? 1 : 0 }}
        >
          <DownloadIcon />
          Lâcher le document ici
        </div>

        <div className={styles.formContainer}>
          <AttachmentDZ
            setDragActive={setDragActive}
            dragActive={dragActive}
            setAttachment={setAttachment}
          />

          <Grid container spacing={4} padding={4}>
            <Grid item xs={9}>
              <NameInput
                name={formValues.name}
                updateForm={updateForm}
                inputName={AccomodationsTable.name}
              />
            </Grid>

            <Grid item xs={3}>
              <PriceInput
                inputName={AccomodationsTable.price}
                price={formValues.price}
                updateForm={updateForm}
              />
            </Grid>

            <Grid item xs={6}>
              <LocationSearchInput
                required
                name={AccomodationsTable.location}
                fullWidth
                variant="standard"
                label="Localisation"
                address={formValues.location}
                setAddress={(address, { lat, lng }, city) =>
                  setFormValues((prevState) => {
                    return {
                      ...prevState,
                      location: address,
                      lng,
                      lat,
                      city: city ?? null,
                    };
                  })
                }
                isLocalisationOk={
                  formValues.lat !== null && formValues.lng !== null
                }
              />
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  sx={{ ".MuiInputBase-input": { height: "auto" } }}
                  ampm={false}
                  label="Checkin"
                  value={dayJsCheckin}
                  onChange={(newValue) =>
                    setFormValues((prevState) => {
                      return {
                        ...prevState,
                        checkin: newValue
                          ? `${newValue.hour()}:${
                              newValue.minute() < 10 ? "0" : ""
                            }${newValue.minute()}`
                          : "18:00",
                      };
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3} display="flex" justifyContent="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  sx={{ ".MuiInputBase-input": { height: "auto" } }}
                  ampm={false}
                  label="Checkout"
                  value={dayJsCheckout ?? null}
                  onChange={(newValue) =>
                    setFormValues((prevState) => {
                      return {
                        ...prevState,
                        checkout: newValue
                          ? `${newValue.hour()}:${
                              newValue.minute() < 10 ? "0" : ""
                            }${newValue.minute()}`
                          : "10:00",
                      };
                    })
                  }
                />
              </LocalizationProvider>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <span>Repas inclus:</span>
              {Object.entries(meals).map(([key, val]) => (
                <Chip
                  key={key}
                  onClick={() => {
                    setFormValues((prevState) => {
                      return {
                        ...prevState,
                        [key]:
                          ((prevState[
                            key as keyof TFormAccomodation
                          ] as number) +
                            1) %
                          2,
                      };
                    });
                  }}
                  size="small"
                  icon={val.icon()}
                  label={val.text}
                  color="primary"
                  variant={
                    formValues[key as keyof TFormAccomodation]
                      ? "filled"
                      : "outlined"
                  }
                  sx={{ width: "100px" }}
                />
              ))}
            </Grid>
            <Grid item xs={8}>
              <DescriptionInput
                description={formValues.description}
                updateForm={updateForm}
                inputName={AccomodationsTable.description}
              />
            </Grid>
            <Grid item xs={4}>
              <StatusSelector
                inputName={AccomodationsTable.status}
                status={formValues.status}
                updateForm={updateForm}
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
