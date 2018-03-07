import firebase from 'firebase';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAsSli9Jzp6GsQzc4r0-NluYfd7iyb8t4w",
    authDomain: "vue-project-c62fd.firebaseapp.com",
    databaseURL: "https://vue-project-c62fd.firebaseio.com",
    projectId: "vue-project-c62fd",
    storageBucket: "vue-project-c62fd.appspot.com",
    messagingSenderId: "751330410500"
});

export const db = app.database();
export const boxesRef = db.ref('boxes');