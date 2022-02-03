import admin from "firebase-admin"
import { initializeApp } from "firebase-admin/app";

import serviceAccount from "./account.json";

export default initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});