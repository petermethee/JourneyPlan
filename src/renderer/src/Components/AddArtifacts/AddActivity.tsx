import { Grid } from "@mui/material";
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
import ImportAttachmentInput from "./Attachment/ImportAttachmentInput";
import IAttachment from "../../Models/IAttachment";
import LocationSearchInput from "./Inputs/LocationSearchInput";
import { TArtifactEditor } from "../Planning/Planning";

import { EEventStatus } from "../../Models/EEventStatus";
import NameInput from "./Inputs/NameInput";
import PriceInput from "./Inputs/PriceInput";
import DescriptionInput from "./Inputs/DescriptionInput";
import StatusSelector from "./Inputs/StatusSelector";
import TimeInput from "./Inputs/TimeInput";

export const AddActivity = forwardRef(
  (
    {
      setSaving,
      id_trip,
      activity,
      setArtifactToEdit,
      isFocused,
    }: {
      setSaving: (savingStatus: ESavingStatus) => void;
      id_trip: number;
      activity?: IActivity;
      setArtifactToEdit: (artifactEditor: TArtifactEditor) => void;
      isFocused: boolean;
    },
    ref,
  ) => {
    const dispatch = useAppDispatch();

    const initialFormValues: TFormActivity = useMemo(() => {
      if (activity) {
        return {
          [ActivitiesTable.name]: activity.name,
          [ActivitiesTable.description]: activity.description,
          [ActivitiesTable.price]: activity.price.toString(),
          [ActivitiesTable.pleasure]: activity.pleasure,
          [ActivitiesTable.location]: activity.location,
          [ActivitiesTable.lat]: activity.lat,
          [ActivitiesTable.lng]: activity.lng,
          [ActivitiesTable.city]: activity.city,
          [ActivitiesTable.status]: activity.status,
          [ActivitiesTable.duration]: activity.duration,
        };
      }
      return {
        [ActivitiesTable.name]: "",
        [ActivitiesTable.description]: "",
        [ActivitiesTable.price]: "0",
        [ActivitiesTable.pleasure]: 0,
        [ActivitiesTable.location]: "",
        [ActivitiesTable.lat]: null,
        [ActivitiesTable.lng]: null,
        [ActivitiesTable.city]: null,
        [ActivitiesTable.status]: EEventStatus.none,
        [ActivitiesTable.duration]: 1,
      };
    }, [activity]);

    const [formValues, setFormValues] =
      useState<TFormActivity>(initialFormValues);

    const initialAttachment = useMemo(
      () => (activity ? activity.attachment : []),
      [activity],
    );
    const [attachment, setAttachment] =
      useState<IAttachment[]>(initialAttachment);

    const [dragActive, setDragActive] = useState(false);

    const clearInputs = () => {
      setFormValues(initialFormValues);
      setAttachment(activity ? activity.attachment : []);
    };

    useImperativeHandle(ref, () => ({
      save(artifactType: EArtifact) {
        if (artifactType === EArtifact.Activity) {
          const newActivity: IActivity = {
            id: 0,
            id_trip,
            ...formValues,
            price: parseFloat(formValues.price),
            attachment,
            used: false,
          };
          dispatch(insertActivity(newActivity)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
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
          const updatedActivity: IActivity = {
            id: activity!.id,
            id_trip,
            ...formValues,
            price: parseFloat(formValues.price),
            attachment,
            used: activity!.used,
          };
          dispatch(updateActivity(updatedActivity)).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
              setArtifactToEdit({ type: EArtifact.Activity });
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
      let value: number | string | null = event.target.value;
      if (name === ActivitiesTable.status) {
        value = value === "null" ? null : value;
      }
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
          formValues.price !== "" &&
          formValues.name !== "" &&
          formValues.location &&
          (JSON.stringify(formValues) !== JSON.stringify(initialFormValues) ||
            initialAttachment.join() !== attachment.join())
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
            <Grid item xs={8}>
              <NameInput
                name={formValues.name}
                updateForm={updateForm}
                inputName={ActivitiesTable.name}
              />
            </Grid>

            <Grid item xs={4}>
              <PriceInput
                inputName={ActivitiesTable.price}
                price={formValues.price}
                updateForm={updateForm}
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
                setLocation={(address, { lat, lng }, city) => {
                  setFormValues((prevState) => {
                    return {
                      ...prevState,
                      location: address,
                      lng,
                      lat,
                      city: city ?? null,
                    };
                  });
                }}
                isLocationOk={
                  formValues.lat !== null && formValues.lng !== null
                }
              />
            </Grid>
            <Grid item xs={4} flexWrap="nowrap" display="flex" gap={1}>
              <TimeInput
                duration={formValues.duration}
                setDuration={(value) =>
                  setFormValues((prevState) => {
                    return { ...prevState, duration: value };
                  })
                }
              />
            </Grid>
            <Grid item xs={8}>
              <DescriptionInput
                description={formValues.description}
                updateForm={updateForm}
                inputName={ActivitiesTable.description}
              />
            </Grid>
            <Grid item xs={4}>
              <StatusSelector
                inputName={ActivitiesTable.status}
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
                        prevState.filter((newPJ) => newPJ.path !== PJ.path),
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
  },
);
