import { useMemo, useState } from "react";
import CustomCloseIcon from "../../Shared/CustomCloseIcon";
import cstmCloseIconStyle from "../../Shared/CustomCloseIcon.module.css";
import styles from "./AttachmentCard.module.css";
import { Document, Page, pdfjs } from "react-pdf";
import { Fade, Modal } from "@mui/material";
import { setSnackbarStatus } from "../../../features/Redux/tripSlice";
import { useAppDispatch } from "../../../app/hooks";

import workerContent from "../../../assets/pdf.worker.min.json";

const workerBlob = new Blob([workerContent], { type: "text/javascript" });
const workerBlobURL = URL.createObjectURL(workerBlob);
pdfjs.GlobalWorkerOptions.workerSrc = workerBlobURL;

export default function AttachmentCard({
  imagePath,
  imageName,
  onDelete,
}: {
  imagePath: string;
  imageName: string;
  onDelete: () => void;
}) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [pdfPageNumber, setPdfPageNumber] = useState(0);

  const isPDF = useMemo(() => {
    const splitted = imagePath.split(".");
    const ext = splitted[splitted.length - 1];
    return ext.toUpperCase() === "PDF";
  }, [imagePath]);

  const Pages = useMemo(() => {
    const pages: JSX.Element[] = [];
    for (let i = 1; i < pdfPageNumber + 1; i++) {
      pages.push(
        <Page
          className={styles.pdfPage}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          pageNumber={i}
          key={i}
        />
      );
    }

    return pages;
  }, [pdfPageNumber]);

  return (
    <div className={styles.container + " " + cstmCloseIconStyle.container}>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in={open}>
          <div className={styles.modalChild}>
            {isPDF ? (
              <Document file={imagePath} className={styles.pdfContainer}>
                {Pages}
              </Document>
            ) : (
              <img
                alt="piece jointe"
                className={styles.fullScreenImg}
                src={imagePath}
              />
            )}
          </div>
        </Fade>
      </Modal>

      <div className={styles.imageContainer} onClick={() => setOpen(true)}>
        {isPDF ? (
          <Document
            file={imagePath}
            onLoadSuccess={({ numPages }) => {
              setPdfPageNumber(numPages);
            }}
            onLoadError={(err) =>
              dispatch(
                setSnackbarStatus({
                  message:
                    "Impossible de charger le pdf: " + imagePath + " : " + err,
                  snackBarSeverity: "error",
                })
              )
            }
          >
            <Page pageNumber={1} height={170} />;
          </Document>
        ) : (
          <img alt="piece jointe" className={styles.image} src={imagePath} />
        )}
        <CustomCloseIcon
          sx={{
            right: "5px",
            top: "5px",
          }}
          onDelete={onDelete}
          size="18px"
        />
      </div>

      <label className={styles.label}>{imageName}</label>
    </div>
  );
}
