import React from "react";
import IActivity from "../../../Models/IActivity";
import styles from "./ActivityDataCard.module.css";

export default function ActivityDataCard({
  activity,
}: {
  activity: IActivity;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{activity.name}</div>
        <span>{activity.price} €/p</span>
      </div>
      <div>Lieu</div>
      <div>Pièce jointe</div>
      <div className={styles.description}>{activity.description}</div>
    </div>
  );
}
