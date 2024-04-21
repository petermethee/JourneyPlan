import React, { CSSProperties, useState } from "react";
import styles from "./AmazingCardEffect.module.css";
export default function AmazingCardEffect({
  children,
  buttons,
}: {
  children: React.ReactNode;
  buttons: React.ReactNode;
}) {
  const [style, setStyle] = useState<CSSProperties>({
    transform: "rotateX(0deg) rotateY(0deg)",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const thresholdY = 40;
    const thresholdX = 60;

    // rotate logo based on mouse position
    const { clientX, clientY } = e;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const mouseY = (clientY - top) / height - 0.5;
    const mouseX = (clientX - left) / width - 0.5;
    const rotateY = -mouseX * thresholdY;
    const rotateX = mouseY * thresholdX;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "100ms",
    });
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.childContainer}
        onMouseLeave={() =>
          setStyle({
            transform: "rotateX(0deg) rotateY(0deg)",
            transition: "500ms",
          })
        }
        onMouseMove={handleMouseMove}
        style={{
          ...style,
        }}
      >
        {children}
      </div>

      <div className={styles.buttonsContainer}>{buttons}</div>
    </div>
  );
}
