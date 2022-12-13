
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa01ulnxl6U5tuzY0S9LUNHW-4JQKwQGc",
  authDomain: "gallery-app-9416f.firebaseapp.com",
  projectId: "gallery-app-9416f",
  storageBucket: "gallery-app-9416f.appspot.com",
  messagingSenderId: "733897846241",
  appId: "1:733897846241:web:0e1b615c3bb4ba3620b6a0"
};


const app = initializeApp(firebaseConfig);

// export const storage = getStorage(app);
// export const db = getFirestore(app);

export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);


 