import { useContext, useState } from "react";
import { UserContext } from "../libs/context";
import { auth, googleAuthProvider } from "../libs/firebase";

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
    const {user, username} = useContext(UserContext)

    const [formValue, setFormValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
    };

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        setFormValue(val);
    };

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
    return <p></p>;
}
