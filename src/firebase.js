// firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDtLZQr4TqP3mgzVNG632fo4RPtDyALgEo",
    authDomain: "testpanel-25a30.firebaseapp.com",
    projectId: "testpanel-25a30",
    storageBucket: "testpanel-25a30.appspot.com",
    messagingSenderId: "8305784544",
    appId: "1:8305784544:web:c5e44d7c1e82d632a54285",
    measurementId: "G-56HY392DPH"
  }

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
