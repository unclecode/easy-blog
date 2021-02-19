import debounce from "lodash.debounce";
import { useContext, useEffect, useState, useCallback } from "react";
import { UserContext } from "../libs/context";
import { auth, firestore, googleAuthProvider } from "../libs/firebase";

export default function EnterPage({}) {
    const { user, username } = useContext(UserContext);
    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
}

function SignInButton() {
    return (
        <button
            className="btn-google"
            onClick={async () => await auth.signInWithPopup(googleAuthProvider)}
        >
            <img src={"/google.png"} /> Sign in with Google
        </button>
    );
}
function SignOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
function UsernameForm() {
    const { user, username } = useContext(UserContext);

    const [formValue, setFormValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });
        
        await batch.commit();
    };

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
        setFormValue(val);
        setIsValid(false);
        if (val.length < 3) {
            setLoading(false);
        }
        if (re.test(val)) {
            setLoading(true);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`users/${username}`);
                const { exist } = ref.get();
                setIsValid(!exist);
                setLoading(false);
                console.log("Firestore read executed!");
            }
        }, 500),
        []
    );

    return (
        <>
            {!username && (
                <section>
                    <h3>Choose Username</h3>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={formValue}
                            onChange={onChange}
                        />
                        <UsernameMessage
                            username={formValue}
                            isValid={isValid}
                            loading={loading}
                        ></UsernameMessage>

                        <button
                            type="submit"
                            className="btn-green"
                            disabled={!isValid}
                        >
                            Choose
                        </button>

                        <h3>Debug State</h3>
                        <div>
                            Username: {formValue}
                            <br />
                            Loading: {loading.toString()}
                            <br />
                            Username Valid: {isValid.toString()}
                        </div>
                    </form>
                </section>
            )}
            {/* <SignOutButton></SignOutButton> */}
        </>
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Loading...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (!isValid && username && username.length >=3) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
}
