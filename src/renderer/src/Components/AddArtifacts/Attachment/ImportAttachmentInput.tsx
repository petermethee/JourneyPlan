import React, { useId } from "react";
import styles from "./ImportAttachmentInput.module.css";
import { useAppDispatch } from "../../../app/hooks";
import { setSnackbarStatus } from "../../../features/Redux/tripSlice";
import IAttachment from "../../../Models/IAttachment";

export default function ImportAttachmentInput({
  setAttachment,
}: {
  setAttachment: React.Dispatch<React.SetStateAction<IAttachment[]>>;
}) {
  const inputFileId = useId();

  const dispatch = useAppDispatch();

  // triggers when file is selected with click
  const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files) {
      let images = Object.values(e.target.files) as unknown as IAttachment[];

      setAttachment((prevState) => {
        const invalidFilesExtension: string[] = [];
        const duplicatedFiles: string[] = [];
        images = images.filter((image) => {
          const splitedName = image.path.split(".");
          const extension = splitedName[splitedName.length - 1].toLowerCase();
          const isValid =
            extension === "jpg" ||
            extension === "jpeg" ||
            extension === "png" ||
            extension === "pdf";
          const allreadyExist = prevState.some(
            (attachment) => attachment.path === image.path
          );
          !isValid && invalidFilesExtension.push(image.name);
          allreadyExist && duplicatedFiles.push(image.name);
          return isValid && !allreadyExist;
        });

        invalidFilesExtension.length &&
          dispatch(
            setSnackbarStatus({
              message:
                "Ces fichiers ne sont pas au bon format: " +
                invalidFilesExtension,
              snackBarSeverity: "error",
            })
          );

        duplicatedFiles.length &&
          dispatch(
            setSnackbarStatus({
              message: "Ces fichies ont déjà été importés: " + duplicatedFiles,
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
      e.target.value = "";
    }
  };

  return (
    <div className={styles.attachmentLabels}>
      <input
        accept=".pdf, .jpg, .jpeg, .png"
        type="file"
        id={inputFileId}
        multiple={true}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <label>Pièce(s) jointe(s):</label>
      <div>
        <label style={{ color: "#414141" }}>
          Glisser / Déposer les fichiers ou
        </label>

        <label htmlFor={inputFileId} className={styles.attachmentLabelInput}>
          Importer
        </label>
      </div>
    </div>
  );
}
