import { getFirestore } from "firebase-admin/firestore";

import firebase from "./firebase";

const db = getFirestore(firebase);

const pause = () => new Promise((resolve) => setTimeout(resolve, 10000));

const BATCH_LIMIT = 499;
export const writeBatchQueue = (() => {
  const batches = [db.batch()];
  let queue: Promise<any> = Promise.resolve();
  let size = 0;
  return (clear?: boolean) => {
    if (size >= BATCH_LIMIT || clear) {
      const lastBatch = batches.length - 1;
      const batchSize = size;
      size = 0;
      queue = queue
        .then(() => batches[lastBatch].commit())
        .then(() =>
          console.log("committed batch", lastBatch * BATCH_LIMIT, lastBatch * BATCH_LIMIT + batchSize)
        )
        .then(() => pause());
      if (!clear) {
        batches.push(db.batch());
      } else {
        queue.then(() => {
          batches.length = 0;
          batches.push(db.batch());
        })
        console.log("final commit");
      }
    }
    size += 1;
    return batches[batches.length - 1];
  };
})();

export default db;
