export const ipcGetIP = async () => {
  const ipAdress = await window.electronAPI.exemple();
  return ipAdress;
};
