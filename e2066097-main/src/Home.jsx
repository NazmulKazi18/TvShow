import { useEffect, useState } from "react";
import { Tvshow } from "./Tvshow.jsx";

export function Home() {
    const [tvshows, setTvshows] = useState([]);
    const [filtrerShow, setFilterShow] = useState("");
    const [filtrerStudio, setFilterStudio] = useState("");
    const [studios, setStudios] = useState([]);
    const [taillePage, setTaillePage] = useState(8);
    const [pageCourante, setPageCourante] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchTvShows = async () => {
            try {
                const response = await fetch("https://tvshowdbapi.herokuapp.com/tvshows");
                if (response.ok) {
                    const data = await response.json();
                    setTvshows(data);
                } else {
                    throw new Error("Failed to fetch tvshows");
                }
            } catch (error) {
                setErrorMessage("Error fetching tvshows: " + error.message);
                console.error("Error fetching tvshows:", error);
            }
        };

        const fetchStudios = async () => {
            try {
                const response = await fetch("https://tvshowdbapi.herokuapp.com/studios");
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        const studioNames = data.map(studio => studio.name);
                        setStudios(studioNames);
                    } else {
                        throw new Error("Studios data is missing or invalid");
                    }
                } else {
                    throw new Error("Failed to fetch studios");
                }
            } catch (error) {
                setErrorMessage("Error fetching studios: " + error.message);
                console.error("Error fetching studios:", error);
            }
        };

        fetchTvShows();
        fetchStudios(); 
    }, []);

    function filtrerAnime() {
        let tvs = tvshows;
        if (filtrerShow !== "") {
            tvs = tvs.filter(tv => tv.title.toUpperCase().includes(filtrerShow.toUpperCase()));
        }
        if (filtrerStudio !== "") {
            tvs = tvs.filter(tv => tv.studio.name === filtrerStudio);
        }
        return tvs;
    }

    function nbPages() {
        return Math.ceil(tvshows.length / taillePage);
    }

    function pagination() {
        const debut = (pageCourante - 1) * taillePage;
        const fin = debut + taillePage;
        return filtrerAnime().slice(debut, fin);
    }

    function tabpages() {
        const tab = [];
        for (let i = 1; i <= nbPages(); i++) {
            tab.push(i);
        }
        return tab;
    }

    return (
        <div className="container">
            <div className="section">
                {errorMessage && (
                    <div tabIndex="0" role="alert" className="notification is-danger">
                        {errorMessage}
                    </div>
                )}
                <div role="search" className="field is-horizontal">
                    <div className="field-label is-normal">
                        <label htmlFor="titre" className="label">Titre</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <p className="control is-expanded">
                                <input
                                    id="titre"
                                    className="input"
                                    type="text"
                                    placeholder="Titre de l'album"
                                    value={filtrerShow}
                                    onChange={(e) => setFilterShow(e.target.value)}
                                    aria-required="true"
                                />
                            </p>
                        </div>
                    </div>
                </div>
                <div role="search" className="field is-horizontal" style={{ paddingLeft: "20px" }}>
                    <div className="field-label is-normal">
                        <label className="label" htmlFor="studio">Studio</label>
                    </div>
                    <div className="field-body">
                        <div className="field">
                            <div className="control" style={{ minWidth: "200px" }}>
                                <div className="select is-fullwidth">
                                    <select
                                        id="studio"
                                        value={filtrerStudio}
                                        onChange={(e) => setFilterStudio(e.target.value)}
                                        aria-required="true"
                                    >
                                        <option value="">Tous les studios</option>
                                        {studios.map(studio => (
                                            <option key={studio} value={studio}>{studio}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <main role="main" className="row columns is-multiline is-mobile">
                    {pagination().map(tvshow => (
                        <Tvshow key={tvshow.tvshowId} tvshow={tvshow} />
                    ))}
                </main>
                <nav className="pagination" role="navigation" aria-label="pagination">
                    <button
                        className="pagination-previous"
                        disabled={pageCourante === 1 ? "disabled" : null}
                        onClick={() => {
                            if (pageCourante > 1) {
                                setPageCourante(pageCourante - 1);
                            }
                        }}
                    >
                        Previous
                    </button>
                    <button
                        className="pagination-next"
                        disabled={pageCourante === nbPages() ? "disabled" : null}
                        onClick={() => {
                            if (pageCourante < nbPages()) {
                                setPageCourante(pageCourante + 1);
                            }
                        }}
                    >
                        Next page
                    </button>
                    <ul className="pagination-list">
                        {tabpages().map(i => (
                            <li key={i}>
                                <button
                                    className={i === pageCourante ? "pagination-link is-current" : "pagination-link"}
                                    onClick={() => setPageCourante(i)}
                                    aria-label={`Go to page ${i}`}
                                >
                                    {i}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="has-text-centered">
                    <label htmlFor="taillePage" className="label">Items per page:</label>
                    <select
                        id="taillePage"
                        value={taillePage}
                        onChange={(e) => setTaillePage(parseInt(e.target.value))}
                        style={{ width: "100px", height: "40px", fontSize: "16px" }}
                        aria-describedby="taillePage-desc"
                    >
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                    </select>
                    <p id="taillePage-desc" className="help">Select the number of items to display per page</p>
                </div>
            </div>
        </div>
    );
}
