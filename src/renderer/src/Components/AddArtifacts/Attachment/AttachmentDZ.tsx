import styles from "./AttachmentDZ.module.css";
import { useAppDispatch } from "../../../app/hooks";
import { setSnackbarStatus } from "../../../features/Redux/tripSlice";
import IAttachment from "../../../Models/IAttachment";

export default function AttachmentDZ({
  dragActive,
  setDragActive,
  setAttachment,
}: {
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
  setAttachment: React.Dispatch<React.SetStateAction<IAttachment[]>>;
}) {
  const dispatch = useAppDispatch();
  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      let images = Object.values(
        e.dataTransfer.files,
      ) as unknown as IAttachment[];
      setAttachment((prevState) => {
        const invalidFiles: string[] = [];
        images = images.filter((image) => {
          const extension = image.path.split(".")[1].toLowerCase();
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
            }),
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
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`${styles.dropHandler} ${dragActive && styles.dragActive}`}
    />
  );
}
