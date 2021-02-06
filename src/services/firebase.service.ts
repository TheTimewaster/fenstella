import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCjASGCeyidpmEWObf7vBzv9kIq4TcA3Ro",
    authDomain: "thoang-sms-wall.firebaseapp.com",
    projectId: "thoang-sms-wall",
    storageBucket: "thoang-sms-wall.appspot.com",
    messagingSenderId: "575653915712",
    appId: "1:575653915712:web:f4b996261fd25d21fa43a5"
};

export class FirebaseService {
  private firebaseApp: firebase.app.App;

  constructor() {
      this.firebaseApp = FirebaseService.init();
  }

  public get firebaseAppInstance(): firebase.app.App {
      return this.firebaseApp;
  }

  static init() {
      // Initialize Firebase
      return firebase.initializeApp(firebaseConfig);
  }
}

export default new FirebaseService();
