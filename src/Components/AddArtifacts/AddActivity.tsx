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
import styles from "./AddActivity.module.css";
import AttachmentCard from "./Attachment/AttachmentCard";
import AttachmentDZ from "./Attachment/AttachmentDZ";
import { ESavingStatus } from "./AddArtifacts";
import { EArtifact } from "../../Models/EArtifacts";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { insertActivity } from "../../features/Redux/activitiesSlice";
import { selectCurrentTrip } from "../../features/Redux/tripSlice";

export const AddActivity = forwardRef(
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
    const [formValues, setFormValues] = useState<TFormActivity>({
      [ActivitiesTable.name]: "",
      [ActivitiesTable.description]: "",
      [ActivitiesTable.price]: 0,
      [ActivitiesTable.pleasure]: 0,
      [ActivitiesTable.location]: "",
    });

    const [attachment, setAttachment] = useState<
      { path: string; name: string }[]
    >([]);

    const [dragActive, setDragActive] = useState(false);
    const [hours, setHours] = useState("1");
    const [minutes, setMinutes] = useState(0);

    useImperativeHandle(ref, () => ({
      save(child: EArtifact) {
        const duration =
          parseInt(hours) + Math.round((minutes / 4) * 100) / 100;

        const newActivity: IActivity = {
          id: 0,
          id_trip,
          duration,
          ...formValues,
          attachment,
          used: false,
        };
        dispatch(insertActivity(newActivity));
      },
    }));

    const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;
      setFormValues((prevState) => {
        return { ...prevState, [name]: value };
      });
    };

    // triggers when file is selected with click
    const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const image = e.target.files[0] as unknown as {
          path: string;
          name: string;
        };
        setAttachment((prevState) => {
          return [...prevState, { path: image.path, name: image.name }];
        });
      }
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
      if (isHourValid && formValues.name !== "" && formValues.location) {
        setSaving(ESavingStatus.enabled);
      } else {
        setSaving(ESavingStatus.disabled);
      }
    }, [formValues.name, formValues.location, isHourValid, setSaving]);

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
                name={ActivitiesTable.name}
                fullWidth
                variant="standard"
                label="Titre"
                value={formValues.name}
                onChange={updateForm}
                autoFocus
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                name={ActivitiesTable.price}
                fullWidth
                variant="standard"
                label="Prix"
                value={formValues.price}
                onChange={updateForm}
                type="number"
              />
            </Grid>
            <Grid item xs={9}>
              <TextField
                required
                name={ActivitiesTable.location}
                fullWidth
                variant="standard"
                label="Localisation"
                value={formValues.location}
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
                type="number"
                onChange={(event) => setMinutes(parseInt(event.target.value))}
              >
                {[0, 15, 30, 45].map((minute, index) => (
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
                sx={{ height: "100%" }}
              />
            </Grid>
            <Grid item width="100%" display="flex">
              <div className={styles.attachmentLabels}>
                <input
                  accept="image/png, image/jpeg "
                  type="file"
                  id="input-file-upload"
                  multiple={true}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <label>Pièce(s) jointe(s):</label>
                <div>
                  Glisser - déposer les fichiers ou
                  <label
                    htmlFor="input-file-upload"
                    className={styles.attachmentLabelInput}
                  >
                    Importer
                  </label>
                </div>
              </div>
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
