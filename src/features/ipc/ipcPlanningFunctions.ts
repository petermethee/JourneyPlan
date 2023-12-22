import IPlanningArtifact, { IPlanning } from "../../Models/IPlanningArtifact";

export const getAllPlanningsAPI = (idPlanning: number) => {
  return new Promise<IPlanning[]>(async (resolve, reject) => {
    try {
      const plannings = await window.electronAPI.getAllPlannings(idPlanning);
      resolve(plannings);
    } catch (error) {
      reject(error);
    }
  });
};

export const insertPlanningAPI = (planning: IPlanning) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const planningId = await window.electronAPI.insertPlanning(planning);
      resolve(planningId);
    } catch (error) {
      reject(error);
    }
  });
};

export const updatePlanningAPI = (planning: IPlanning) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.updatePlanning(planning);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deletePlanningAPI = (planningId: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.deletePlanning(planningId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

//PlanningArtifacts
export const getAllArtifactsPlanningAPI = (idPlanning: number) => {
  return new Promise<IPlanningArtifact[]>(async (resolve, reject) => {
    try {
      const PA = await window.electronAPI.getAllArtifactsPlanning(idPlanning);
      resolve(PA);
    } catch (error) {
      reject(error);
    }
  });
};

export const insertArtifactPlanningAPI = (
  planningArtifact: IPlanningArtifact
) => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      const planningArtifactId =
        await window.electronAPI.insertArtifactPlanning(planningArtifact);
      resolve(planningArtifactId);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateArtifactPlanningAPI = (
  planningArtifact: IPlanningArtifact
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.updateArtifactPlanning(planningArtifact);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteArtifactPlanningAPI = (planningArtifactId: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.deleteArtifactPlanning(planningArtifactId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const exportAttachmentsAPI = (planningId: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.exportAttachments(planningId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
