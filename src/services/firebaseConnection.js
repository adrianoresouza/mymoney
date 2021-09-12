import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


let firebaseConfig = {
    apiKey: "AIzaSyDuNQU3HZoRYG12VZG3nPaKPXPpqZqiqyY",
    authDomain: "mymoney-d9a7c.firebaseapp.com",
    projectId: "mymoney-d9a7c",
    storageBucket: "mymoney-d9a7c.appspot.com",
    messagingSenderId: "86747491302",
    appId: "1:86747491302:web:448813b073e73ce7df8427",
    measurementId: "G-8Q1VLHRS54"
  };
  // Initialize Firebase

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;