import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCqg3BgcbNvcvc33n_37DqI6x3FEBijrFA",
  authDomain: "todoapp-react-18289.firebaseapp.com",
  databaseURL: "https://todoapp-react-18289.firebaseio.com",
  projectId: "todoapp-react-18289",
  storageBucket: "todoapp-react-18289.appspot.com",
  messagingSenderId: "1061419733874"
};
firebase.initializeApp(config);

export default firebase;