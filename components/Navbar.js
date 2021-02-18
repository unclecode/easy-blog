import React from "react";
import Link from "next/link";
const Navbar = () => {
    let user = null;
    let username = null;
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">Feed</button>
                    </Link>
                </li>

                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue">
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img
                                    src={user?.photoUrl}
                                    alt={user?.photoUrl}
                                />
                            </Link>
                        </li>
                    </>
                )}

                {!username  && (
                    <>
                    <li>
                        <Link href = "/enter">
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
