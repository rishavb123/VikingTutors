const firebaseConfig = {
    apiKey: "AIzaSyAJ2DfPMp88_EaHWt4KgbBdfn4GW7qc-go",
    authDomain: "viking-tutors.firebaseapp.com",
    databaseURL: "https://viking-tutors.firebaseio.com",
    projectId: "viking-tutors",
    storageBucket: "viking-tutors.appspot.com",
    messagingSenderId: "424416194246",
    appId: "1:424416194246:web:a2de9e2732435a5a"
};
firebase.initializeApp(firebaseConfig);

gapi.client.setApiKey("AIzaSyAqIAzdRsjJOpYAK8tfWK2VZfRYbgbKTfg");
gapi.client.load("youtube", "v3");

const db = firebase.firestore();