import { Message } from "@/interface/message";
import firebase from "firebase";
import FirebaseService from "./firebase.service";

class MessagesService {
  private firebaseDatabase: firebase.database.Database;

  constructor() {
      this.firebaseDatabase = FirebaseService.firebaseAppInstance.database();
  }

  public getLatestMessage(callBack: Function): void {
      this.firebaseDatabase
          .ref("messages")
          .limitToFirst(1)
          .on("value", (snapshot) => {
              callBack(snapshot.val());
              return snapshot.val() as Array<Message>;
          });
  }
}
