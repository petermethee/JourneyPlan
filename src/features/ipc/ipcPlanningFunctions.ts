import { IPlanning } from "../../Models/IPlanningArtifact";

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
