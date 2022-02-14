import localForage from "localforage";
import type {PersistStorage} from "recoil-persist";

export const createStore = (name: string): PersistStorage => {
  return localForage.createInstance({
    name,
  }) as PersistStorage;
};