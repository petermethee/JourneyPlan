import React from "react";
import styles from "./ImportAttachmentInput.module.css";
import { useAppDispatch } from "../../../app/hooks";
import { setSnackbarStatus } from "../../../features/Redux/tripSlice";

export default function ImportAttachmentInput({
  setAttachment,
}: {
  setAttachment: React.Dispatch<
    React.SetStateAction<
      {
        path: string;
        name: string;
      }[]
    >
  >;
}) {
  const dispatch = useAppDispatch();

  // triggers when file is selected with click
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      let images = Object.values(e.target.files) as unknown as {
        path: string;
        name: string;
      }[];
      setAttachment((prevState) => {
        const invalidFiles: string[] = [];
        images = images.filter((image) => {
          const extension = image.path.split(".")[1];
          const isValid =
            (extension === "jpg" ||
              extension === "jpeg" ||
              extension === "png" ||
              extension === "pdf") &&
            !prevState.some((attachment) => attachment.path === image.path);
          !isValid && invalidFiles.push(image.name);
          return isValid;
        });

        invalidFiles.length &&
          dispatch(
            setSnackbarStatus({
              message:
                "Certains fichiers ne sont pas valides : " + invalidFiles,
              snackBarSeverity: "warning",
            })
          );
        return [
          ...prevState,
          ...images.map((image) => {
            return { path: image.path, name: image.name };
          }),
        ];
      });
    }
  };

  return (
    <div className={styles.attachmentLabels}>
      <input
        accept=".pdf, .jpg, .jpeg, .png"
        type="file"
        id="input-file-upload"
        multiple={true}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <label>Pièce(s) jointe(s):</label>
      <div>
        <label style={{ color: "#414141" }}>
          Glisser / Déposer les fichiers ou
        </label>

        <label
          htmlFor="input-file-upload"
          className={styles.attachmentLabelInput}
        >
          Importer
        </label>
      </div>
    </div>
  );
}
