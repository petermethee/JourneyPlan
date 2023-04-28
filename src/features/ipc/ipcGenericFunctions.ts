import { IItem } from "../../Models/IItem";

export const getAllItemsAPI = (tableName: string, tripId: number) => {
  return new Promise<IItem[]>(async (resolve, reject) => {
    try {
      const activities = await window.electronAPI.getAllItems(
        tableName,
        tripId
      );
      resolve(activities);
    } catch (error) {
      reject(error);
    }
  });
};

export const insertItemAPI = (tableName: string, item: IItem) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.insertItem(tableName, item);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateItemAPI = (tableName: string, item: IItem) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.updateItem(tableName, item);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteItemAPI = (tableName: string, itemId: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.deleteItem(tableName, itemId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
