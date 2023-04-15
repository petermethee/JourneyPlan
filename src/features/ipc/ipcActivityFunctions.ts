import IActivity from "../../Models/IActivity";

export const getAllActivitiesAPI = (tripId: number) => {
  return new Promise<IActivity[]>(async (resolve, reject) => {
    try {
      const activities = await window.electronAPI.getAllActivities(tripId);
      resolve(activities);
    } catch (error) {
      reject(error);
    }
  });
};

export const insertActivityAPI = (activity: IActivity) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.insertActivity(activity);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateActivityAPI = (activity: IActivity) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.updateActivity(activity);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteActivityAPI = (activityId: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.deleteActivity(activityId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
