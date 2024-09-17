import { useEffect, useContext, useState } from "react";
import { TokenContext, HistoryContext } from "./App";
import { Link } from "react-router-dom";

export function History() {
    const { token } = useContext(TokenContext);
    const { history, setHistory } = useContext(HistoryContext);
    const [pageSize, setPageSize] = useState(6); 
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await fetch("https://tvshowdbapi.herokuapp.com/user/history", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setHistory(data);
                } else {
                    setErrorMessage("Failed to fetch user history");
                    console.error("Failed to fetch user history");
                }
            } catch (error) {
                setErrorMessage("Error fetching user history: " + error.message);
                console.error("Error fetching user history:", error);
            }
        }

        if (token) {
            fetchHistory();
        }
    }, [token, setHistory]);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 768) {
                setPageSize(3); 
            } else {
                setPageSize(2); 
            }
        }

        handleResize(); 
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="container">
            <h1 className="title">History</h1>
            {errorMessage && (
                <div tabIndex="0" role="alert" className="notification is-danger">
                    {errorMessage}
                </div>
            )}
            <div className="columns is-multiline" role="list">
                {history && history.length > 0 ? (
                    history.map((episode, index) => (
                        <div className={`column is-${12 / pageSize}`} key={index} role="listitem">
                            <Link to={`/Details/${episode.tvshowId}`} aria-label={`View details of ${episode.episodeTitle}`}>
                                <img src={episode.imgURL} alt={`Episode ${episode.episodeNumber} of season ${episode.seasonNumber} from ${episode.episodeTitle}`} />
                            </Link>
                            <p>Title: <Link to={`/Details/${episode.tvshowId}`} aria-label={`View details of ${episode.episodeTitle}`}>{episode.episodeTitle}</Link></p>
                            <p>Season: <Link to={`/season/${episode.seasonId}`} aria-label={`View season ${episode.seasonNumber}`}>{episode.seasonNumber}</Link></p>
                            <p>Episode: <Link to={`/viewepisode/${episode.episodeId}`} aria-label={`View episode ${episode.episodeNumber}`}>{episode.episodeNumber}</Link></p>
                        </div>
                    ))
                ) : (
                    <p>There is no history to display.</p>
                )}
            </div>
        </div>
    );
}
