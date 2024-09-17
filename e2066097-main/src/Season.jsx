import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { HistoryContext, TokenContext } from "./App";

export function Season() {
    const { seasonId } = useParams();
    const [episodes, setEpisodes] = useState([]);
    const [tvshowTitle, setTvshowTitle] = useState("");
    const [seasonNumber, setSeasonNumber] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(8);
    const { history, setHistory } = useContext(HistoryContext);
    const { token } = useContext(TokenContext);

    useEffect(() => {
        async function fetchSeasonDetails() {
            try {
                const response = await fetch(`https://tvshowdbapi.herokuapp.com/episodes?seasonId=${seasonId}`);
                const data = await response.json();
                if (response.ok) {
                    setEpisodes(data.episodes);
                    setTvshowTitle(data.tvshowTitle);
                    setSeasonNumber(data.seasonNumber);
                }
            } catch (error) {
                console.error("Error fetching season details:", error);
            }
        }

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
                    console.error("Failed to fetch user history");
                }
            } catch (error) {
                console.error("Error fetching user history:", error);
            }
        }

        fetchSeasonDetails();
        if (token) {
            fetchHistory();
        }
    }, [seasonId, token, setHistory]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(episodes.length / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, episodes.length);
    const currentEpisodes = episodes.slice(startIndex, endIndex);

    const isEpisodeWatched = (episodeId) => {
        return history.some(ep => ep.episodeId === episodeId);
    };

    return (
        <div className="container">
            <div className="section">
                <h2 style={{ textAlign: "center", fontSize: "2em" }}><b>{tvshowTitle}</b></h2>
                <h2 style={{ textAlign: "center", fontSize: "2em" }}><b>{seasonNumber}</b></h2>
                <br />
                <div className="row columns is-multiline is-mobile">
                    {currentEpisodes.map(episode => (
                        <div key={episode.episodeId} className="column is-3">
                            <Link to={`/viewepisode/${episode.episodeId}`}>
                                <div style={{ filter: isEpisodeWatched(episode.episodeId) ? "grayscale(100%)" : "none" }}>
                                    <img src={episode.imgURL} alt={episode.tvshowTitle} />
                                    <p>Title: <b>{episode.title}</b></p>
                                    <p><b>{episode.number}</b></p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <nav className="pagination" role="navigation" aria-label="pagination">
                    <button
                        className="pagination-previous"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        aria-label="Previous page"
                    >
                        Previous
                    </button>
                    <button
                        className="pagination-next"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        aria-label="Next page"
                    >
                        Next
                    </button>
                    <ul className="pagination-list">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1}>
                                <button
                                    className={currentPage === i + 1 ? "pagination-link is-current" : "pagination-link"}
                                    onClick={() => handlePageChange(i + 1)}
                                    aria-label={`Page ${i + 1}`}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
