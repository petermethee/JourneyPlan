import React from "react";
import styles from "./GenericTooltips.module.css";
export default function GenericTooltips({
  startTime,
  endTime,
  description,
  pj,
  visible,
}: {
  startTime: string;
  endTime: string;
  description?: string;
  pj: string[];
  visible: boolean;
}) {
  return (
    <>
      <div className={styles.startTime}>{startTime}</div>
      <div className={styles.startTime}>{endTime}</div>
      <div className={styles.startTime}>{description}</div>
    </>
  );
}
