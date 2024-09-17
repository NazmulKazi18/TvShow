import { useContext } from "react";
import { Link } from "react-router-dom";
import { TokenContext } from "./App";

export function Menu() {
    const { token, setToken } = useContext(TokenContext);

    const handleLogout = () => {
        // Effectuer les actions nécessaires pour déconnecter l'utilisateur
        // Par exemple, vider le token du contexte et du sessionStorage
        setToken(null);
        sessionStorage.removeItem("token");
    };

    return (
        <nav className="navbar is-link" role="navigation" aria-label="main navigation">
            <div className="navbar-menu">
                <div className="navbar-start">
                    <Link to="/" className="navbar-item" aria-label="Go to TP2 homepage">TP2</Link>
                    {token ? (
                        <>
                            <Link to="/history" className="navbar-item" aria-label="View your history">History</Link>
                            <Link to="/profile" className="navbar-item" aria-label="View your profile">Profile</Link>
                            <button className="navbar-item button is-danger" onClick={handleLogout} aria-label="Log out">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="navbar-item" aria-label="Sign up for a new account">Sign Up</Link>
                            <Link to="/login" className="navbar-item" aria-label="Log in to your account">Login</Link>
                        </>
                    )}
                    <Link to="/about" className="navbar-item" aria-label="Learn more about us">About</Link>
                </div>
            </div>
        </nav>
    );
}
