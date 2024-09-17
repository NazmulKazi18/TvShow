import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { NoMatch } from "./NoMatch.jsx";
import { Details } from "./Details.jsx";
import { Menu } from "./Menu.jsx";
import { Login } from "./login.jsx";
import { Season } from "./Season.jsx";
import JouerEpisode from "./JouerEpisode.jsx";
import  { History } from "./history.jsx";

import { createContext, useState, useEffect } from "react";

export const TokenContext = createContext();
export const HistoryContext = createContext();

export function App() {
    const [token, setToken] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Vérifie si un token est présent dans le sessionStorage lors du chargement de l'application
        const storedToken = sessionStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            <HistoryContext.Provider value={{history, setHistory}}>
                <BrowserRouter>
                    <Menu />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" element={<NoMatch />} />
                        <Route path="/Details/:tvshowId" element={<Details />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/season/:seasonId" element={<Season />} />
                        <Route path="/viewepisode/:episodeId" element={<JouerEpisode />} />
                        <Route path="/History" element={<History />} />
                    </Routes>
                </BrowserRouter>
            </HistoryContext.Provider>
        </TokenContext.Provider>
    );
}
