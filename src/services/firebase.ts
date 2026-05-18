import { getApps, initializeApp } from "@react-native-firebase/app";

export const initFirebase = () => {
  if (getApps().length === 0) {
    initializeApp();
  }
};
