import { EArtifact } from "@renderer/Models/EArtifacts";
import { useState } from "react";
import AddArtifacts from "../AddArtifacts/AddArtifacts";
import Planning, { TArtifactEditor } from "../Planning/Planning";
import { Route, Routes } from "react-router-dom";
import { ERouterPaths } from "@renderer/Helper/ERouterPaths";
import MapSummary from "../Map/MapSummary";
import PdfGenerator from "../PDF/PdfGenerator";

export default function Trip() {
  const [openModal, setOpenModal] = useState(false);
  const [artifactToEdit, setArtifactToEdit] = useState<TArtifactEditor>({
    type: EArtifact.Activity,
  });

  return (
    <>
      <Routes>
        <Route
          path={ERouterPaths.planning.replace("/trip", "") + "/:tripId"}
          element={
            <Planning
              setArtifactToEdit={(artifact) => {
                setArtifactToEdit(artifact);
                setOpenModal(true);
              }}
            />
          }
        />
        <Route
          path={ERouterPaths.map.replace("/trip", "")}
          element={
            <MapSummary
              setArtifactToEdit={(artifact) => {
                setArtifactToEdit(artifact);
                setOpenModal(true);
              }}
            />
          }
        />
        <Route
          path={ERouterPaths.pdf.replace("/trip", "")}
          element={<PdfGenerator />}
        />
      </Routes>
      {openModal && (
        <AddArtifacts
          setOpen={setOpenModal}
          artifactToEdit={artifactToEdit}
          openModal={openModal}
          setArtifactToEdit={setArtifactToEdit}
        />
      )}
    </>
  );
}
