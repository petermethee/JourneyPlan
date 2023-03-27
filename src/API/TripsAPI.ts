export const getAllTrips = async () => {
  const allTrips = await window.electronAPI.getAllTrips();
  return allTrips;
};
