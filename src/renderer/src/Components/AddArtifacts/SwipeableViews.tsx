import styles from "./SwipeableViews.module.css";
import { EArtifact } from "../../Models/EArtifacts";
import IAccommodation from "../../Models/IAccommodation";
import IActivity from "../../Models/IActivity";
import ITransport from "../../Models/ITransport";
import { TArtifactEditor } from "../Planning/Planning";
import { AddAccommodation } from "./AddAccommodation";
import { AddActivity } from "./AddActivity";
import { ESavingStatus, tabs, TRefElem } from "./AddArtifacts";
import { AddTransport } from "./AddTransport";

export default function SwipeableViews({
  addActivityRef,
  artifactToEdit,
  addTransportRef,
  addAccommodationRef,
  setArtifactToEdit,
  setSaving,
  tab,
  id_trip,
}: {
  tab: EArtifact;
  setArtifactToEdit: (artifact: TArtifactEditor) => void;
  artifactToEdit: TArtifactEditor;
  setSaving: (status: ESavingStatus) => void;
  addActivityRef: React.MutableRefObject<TRefElem | undefined>;
  addTransportRef: React.MutableRefObject<TRefElem | undefined>;
  addAccommodationRef: React.MutableRefObject<TRefElem | undefined>;
  id_trip?: number;
}) {
  return (
    <div
      className={styles.sliderContainer}
      style={{ left: `${-100 * tabs.findIndex((t) => t.value === tab)}%` }}
    >
      <div>
        <AddActivity
          key="activity"
          id_trip={id_trip!}
          setSaving={setSaving}
          ref={addActivityRef}
          activity={
            artifactToEdit.type === EArtifact.Activity &&
            artifactToEdit.artifact
              ? (artifactToEdit.artifact as IActivity)
              : undefined
          }
          setArtifactToEdit={setArtifactToEdit}
          isFocused={tab === EArtifact.Activity}
        />
      </div>
      <div>
        <AddTransport
          key="transport"
          id_trip={id_trip!}
          setSaving={setSaving}
          ref={addTransportRef}
          transport={
            artifactToEdit.type === EArtifact.Transport &&
            artifactToEdit.artifact
              ? (artifactToEdit.artifact as ITransport)
              : undefined
          }
          setArtifactToEdit={setArtifactToEdit}
          isFocused={tab === EArtifact.Transport}
        />
      </div>
      <div>
        <AddAccommodation
          key="accommodation"
          id_trip={id_trip!}
          setSaving={setSaving}
          ref={addAccommodationRef}
          accommodation={
            artifactToEdit.type === EArtifact.Accommodation &&
            artifactToEdit.artifact
              ? (artifactToEdit.artifact as IAccommodation)
              : undefined
          }
          setArtifactToEdit={setArtifactToEdit}
          isFocused={tab === EArtifact.Accommodation}
        />
      </div>
    </div>
  );
}
