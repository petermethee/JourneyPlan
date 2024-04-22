import React, { useEffect, useState } from "react";
import styles from "./NotificationBadge.module.css";
export default function NotificationBadge({ number }: { number: number }) {
  const [classNameAppear, setClassNameAppear] = useState("");

  useEffect(() => {
    setClassNameAppear(styles.badgeAppear);
  }, []);

  return (
    <span
      className={`${styles.badge} ${
        number !== 0 ? classNameAppear : styles.badgeDisappear
      }`}
    >
      {number}
    </span>
  );
}
