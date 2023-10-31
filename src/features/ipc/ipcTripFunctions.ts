import ITrip from "../../ITrip";

export const getAllTripsAPI = () => {
  return new Promise<ITrip[]>(async (resolve, reject) => {
    try {
      const trips = await window.electronAPI.getAllTrips();
      resolve(trips);
    } catch (error) {
      reject(error);
    }
  });
};

export const insertTripAPI = (trip: ITrip) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.insertTrip(trip);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateTripAPI = (trip: ITrip) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.updateTrip(trip);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteTripAPI = (tripId: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await window.electronAPI.deleteTrip(tripId);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
