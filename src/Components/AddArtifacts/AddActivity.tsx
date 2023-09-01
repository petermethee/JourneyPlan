import { Grid, MenuItem, TextField } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import IActivity, { TFormActivity } from "../../Models/IActivity";
import { ActivitiesTable } from "../../Models/DataBaseModel";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./AddArtifacts.module.css";
import AttachmentCard from "./Attachment/AttachmentCard";
import AttachmentDZ from "./Attachment/AttachmentDZ";
import { ESavingStatus } from "./AddArtifacts";
import { EArtifact } from "../../Models/EArtifacts";
import { useAppDispatch } from "../../app/hooks";
import {
  insertActivity,
  updateActivity,
} from "../../features/Redux/activitiesSlice";
import { setSnackbarStatus } from "../../features/Redux/tripSlice";
import ImportAttachmentInput from "./Attachment/ImportAttachmentInput";
import IAttachment from "../../Models/IAttachment";
import LocationSearchInput from "./LocationSearchInput";

export const AddActivity = forwardRef(
  (
    {
      setSaving,
      id_trip,
      activity,
    }: {
      setSaving: (savingStatus: ESavingStatus) => void;
      id_trip: number;
      activity?: IActivity;
    },
    ref
  ) => {
    const dispatch = useAppDispatch();

    const initialFormValues = useMemo(() => {
      if (activity) {
        return {
          [ActivitiesTable.name]: activity.name,
          [ActivitiesTable.description]: activity.description,
          [ActivitiesTable.price]: activity.price,
          [ActivitiesTable.pleasure]: activity.pleasure,
          [ActivitiesTable.location]: activity.location,
        };
      }
      return {
        [ActivitiesTable.name]: "",
        [ActivitiesTable.description]: "",
        [ActivitiesTable.price]: 0,
        [ActivitiesTable.pleasure]: 0,
        [ActivitiesTable.location]: "",
      };
    }, [activity]);

    const [formValues, setFormValues] =
      useState<TFormActivity>(initialFormValues);

    const initialAttachment = useMemo(
      () => (activity ? activity.attachment : []),
      [activity]
    );
    const [attachment, setAttachment] =
      useState<IAttachment[]>(initialAttachment);

    const initialHours = useMemo(
      () => (activity ? activity.duration.toString().split(".")[0] : "1"),
      [activity]
    );
    const [hours, setHours] = useState(initialHours);

    const initMinute = useMemo(() => {
      const min = activity?.duration.toString().split(".");
      if (min && min.length > 1) {
        return (parseInt(min[1]) / 10) * 4;
      }
      return 0;
    }, [activity?.duration]);

    const [minutes, setMinutes] = useState(initMinute);
    const [dragActive, setDragActive] = useState(false);

    const clearInputs = () => {
      setFormValues(initialFormValues);
      setAttachment(activity ? activity.attachment : []);
      setHours(activity ? activity.duration.toString().split(".")[0] : "1");
      setMinutes(initMinute);
    };

    useImperativeHandle(ref, () => ({
      save(artifactType: EArtifact) {
        if (artifactType === EArtifact.Activity) {
          const duration =
            parseInt(hours) + Math.round((minutes / 4) * 100) / 100;

          const newActivity: IActivity = {
            id: 0,
            id_trip,
            duration,
            ...formValues,
            attachment,
            used: 0,
          };
          dispatch(insertActivity(newActivity)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              dispatch(
                setSnackbarStatus({
                  message: "Votre activité a correctement été ajoutée",
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
        if (artifactType === EArtifact.Activity) {
          const duration =
            parseInt(hours) + Math.round((minutes / 4) * 100) / 100;

          const updatedActivity: IActivity = {
            id: activity!.id,
            id_trip,
            duration,
            ...formValues,
            attachment,
            used: activity!.used,
          };
          dispatch(updateActivity(updatedActivity)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              dispatch(
                setSnackbarStatus({
                  message: "L'activité a correctement été mise à jour",
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
      } else if (
        hourNum < 0 ||
        hourNum > 23 ||
        (hourNum === 0 && minutes === 0)
      ) {
        return false;
      }
      return true;
    }, [hours, minutes]);

    useEffect(() => {
      if (
        isHourValid &&
        formValues.name !== "" &&
        formValues.location &&
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
      minutes,
      hours,
      initMinute,
      initialHours,
      attachment,
      initialAttachment,
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
                name={ActivitiesTable.name}
                fullWidth
                variant="standard"
                label="Titre"
                value={formValues.name}
                onChange={updateForm}
                autoFocus
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                name={ActivitiesTable.price}
                fullWidth
                variant="standard"
                label="Prix"
                value={formValues.price}
                onChange={updateForm}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={8}>
              <LocationSearchInput
                required
                name={ActivitiesTable.location}
                fullWidth
                variant="standard"
                label="Localisation"
                address={formValues.location}
                setAddress={(address) =>
                  updateForm({
                    target: { value: address, name: ActivitiesTable.location },
                  } as unknown as any)
                }
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
                error={!isHourValid}
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
                name={ActivitiesTable.description}
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
