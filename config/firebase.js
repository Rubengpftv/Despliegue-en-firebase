const path = require("path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require(path.resolve(process.env.FIREBASE_CREDENTIALS));

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth(firebaseApp);

module.exports = {
  auth,
};
