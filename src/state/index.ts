import { recoilPersist } from "recoil-persist";

import type { PersistConfiguration } from "recoil-persist";

export const persist = (config: PersistConfiguration) => {
  const { persistAtom } = recoilPersist(config);
  return persistAtom;
};

export const accountKey = (id: string) => (key: string) => id + '-' + key;
