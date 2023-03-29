import Trip from "../../Models/Trips";

export const getAllTripsAPI = () => {
  return new Promise<Trip[]>(async (resolve, reject) => {
    try {
      const trips = await window.electronAPI.getAllTrips();
      resolve(trips);
    } catch (error) {
      reject(error);
    }
  });
};
