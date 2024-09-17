import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { TokenContext } from "./App";

export function Login() {
    const tokenContext = useContext(TokenContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    function handleHome() {
        navigate("/");
    }

    async function handleLogin() {
        const body = { username, password };
        try {
            const response = await fetch("https://tvshowdbapi.herokuapp.com/auth/token", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(body),
            });
            if (response.ok) {
                const data = await response.json();
                tokenContext.setToken(data.token);
                sessionStorage.setItem("token", data.token);
                navigate("/");
            } else {
                setErrorMessage("Invalid username or password");
                throw new Error("Invalid username or password");
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("Error logging in: " + error.message);
        }
    }

    return (
        <div className="container">
            <div className="section">
                {errorMessage && (
                    <div tabIndex="0" role="alert" className="notification is-danger">
                        {errorMessage}
                    </div>
                )}
                <div className="content">
                    <div className="field">
                        <label htmlFor="username" className="label">Username</label>
                        <div className="control has-icons-left">
                            <input 
                                id="username" 
                                type="text" 
                                placeholder="e1234567" 
                                className="input" 
                                autoComplete="username" 
                                required 
                                onChange={(e) => setUsername(e.target.value)}
                                aria-required="true"
                                aria-describedby="username-desc"
                            />
                            <span className="icon is-small is-left"><i className="fa fa-envelope"></i></span>
                        </div>
                        <p id="username-desc" className="help">Enter your username</p>
                    </div>
                    <div className="field">
                        <label htmlFor="password" className="label">Password</label>
                        <div className="control has-icons-left">
                            <input 
                                id="password" 
                                type="password" 
                                placeholder="*******" 
                                className="input" 
                                autoComplete="current-password" 
                                required 
                                onChange={(e) => setPassword(e.target.value)}
                                aria-required="true"
                                aria-describedby="password-desc"
                            />
                            <span className="icon is-small is-left"><i className="fa fa-lock"></i></span>
                        </div>
                        <p id="password-desc" className="help">Enter your password</p>
                    </div>
                    <div className="field">
                        <div className="control">
                            <button 
                                id="connexion" 
                                className="button is-success" 
                                onClick={handleLogin}
                                aria-label="Log in"
                            >
                                Connexion
                            </button>
                            <button 
                                id="annuler" 
                                className="button is-danger" 
                                onClick={handleHome}
                                aria-label="Cancel and return home"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
