import React, { CSSProperties, useState } from "react";
import logo from "../../assets/journey_plan_v2.png";

import styles from "./Logo.module.css";
export default function Logo() {
  const [style, setStyle] = useState<CSSProperties>({
    transform: "rotateX(0deg) rotateY(0deg)",
  });
  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const THRESHOLD = 80;
    // rotate logo based on mouse position
    const { clientX, clientY } = e;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const mouseY = (clientY - top) / height - 0.5;
    const mouseX = (clientX - left) / width - 0.5;
    const rotateY = -mouseX * THRESHOLD;
    const rotateX = mouseY * THRESHOLD;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "100ms",
    });
  };
  return (
    <div className={styles.container}>
      <img
        onMouseMove={handleMouseMove}
        onMouseLeave={() =>
          setStyle({
            transform: "rotateX(0deg) rotateY(0deg)",
            transition: "500ms",
          })
        }
        className={styles.logo}
        style={{
          ...style,
        }}
        src={logo}
        alt="jp"
      />
    </div>
  );
}
