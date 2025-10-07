// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCxTd-VOUI1CjgnRNF3aJTHObLGmnbsApA",
  authDomain: "movieapp-a480f.firebaseapp.com",
  projectId: "movieapp-a480f",
  storageBucket: "movieapp-a480f.appspot.com",
  messagingSenderId: "736651431847",
  appId: "1:736651431847:web:785a46e35b457df37b3082",
  measurementId: "G-DSY7B88MTT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
