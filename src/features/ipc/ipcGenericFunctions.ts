import { EArtifactTableName } from "../../Models/EArtifacts";
import IAttachment from "../../Models/IAttachment";
import { IItem } from "../../Models/IItem";

export const getAllItemsAPI = (
  tableName: EArtifactTableName,
  tripId: number
) => {
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

export const insertItemAPI = (tableName: EArtifactTableName, item: IItem) => {
  return new Promise<{
    id: number;
    newAttachments: IAttachment[];
  }>(async (resolve, reject) => {
    try {
      const result = await window.electronAPI.insertItem(tableName, item);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateItemAPI = (tableName: EArtifactTableName, item: IItem) => {
  return new Promise<IAttachment[]>(async (resolve, reject) => {
    try {
      const newAttachments = await window.electronAPI.updateItem(
        tableName,
        item
      );
      resolve(newAttachments);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteItemAPI = (
  tableName: EArtifactTableName,
  itemId: number
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.deleteItem(tableName, itemId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
