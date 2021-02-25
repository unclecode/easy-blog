import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore, increment } from "../libs/firebase";

function HeartButton({ postRef }) {
    const hearRef = postRef.collection("hearts").doc(auth.currentUser.uid);
    const [heartDoc] = useDocument(hearRef);

    const addHeart = async () => {
        const batch = firestore.batch();

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(hearRef, { uid: auth.currentUser.uid });

        await batch.commit();
    };
    const removeHeart = async () => {
        const batch = firestore.batch();

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(hearRef);

        await batch.commit();
    };
    // console.log(heartDoc?.exists);
    return heartDoc?.exists ? (
        <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
        <button onClick={addHeart}>💗 Heart</button>
    );
}

export default HeartButton;
