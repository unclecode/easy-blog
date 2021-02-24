import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDjdC16w1ls3QferJ_QywdGb29oeQ0Xq-w",
    authDomain: "easy-blog-9e420.firebaseapp.com",
    projectId: "easy-blog-9e420",
    storageBucket: "easy-blog-9e420.appspot.com",
    messagingSenderId: "708130972079",
    appId: "1:708130972079:web:0f8c6fe29eb0347e2b0f5a",
    measurementId: "G-VLR7Q15FWR",
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const getUserWithUsername = async (username) => {
    const query = firestore
        .collection("users")
        .where("username", "==", username)
        .limit(1);
    const userDoc = (await query.get()).docs[0];
    return userDoc;
};

export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data?.createdAt?.toMillis() || 0,
        updatedAt: data?.updatedAt?.toMillis() || 0,
    };
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage();
export const firestore = firebase.firestore();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;


export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;