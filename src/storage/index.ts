import localForage from "localforage";

export const createStore = (name: string) => {
  return localForage.createInstance({
    name,
  });
};

export const appStore = createStore('app');
export const accountStore = createStore('account');