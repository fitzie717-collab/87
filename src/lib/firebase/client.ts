
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "contentmix-8xvyl",
  appId: "1:170307645872:web:2408f5a8af65eb29792675",
  storageBucket: "contentmix-8xvyl.firebasestorage.app",
  apiKey: "AIzaSyBbdihjueFTQ1UhVJ8lIjTrDcPfrAKS9FI",
  authDomain: "contentmix-8xvyl.firebaseapp.com",
  messagingSenderId: "170307645872",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

    