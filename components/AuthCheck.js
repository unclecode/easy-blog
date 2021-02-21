import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../libs/context";

function AuthCheck(props) {
    const { username } = useContext(UserContext);

    return username
        ? props.children
        : props.fallback || <Link href="/enter">You must be signed in</Link>;
}

export default AuthCheck;
