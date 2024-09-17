import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function Details() {
    const [tvShowDetails, setTvShowDetails] = useState(null);
    const { tvshowId } = useParams();

    useEffect(() => {
        const fetchTvShowDetails = async () => {
            try {
                const response = await fetch(`https://tvshowdbapi.herokuapp.com/tvshow?tvshowId=${tvshowId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTvShowDetails(data);
                } else {
                    throw new Error("Failed to fetch tv show details");
                }
            } catch (error) {
                console.error("Error fetching tv show details:", error);
            }
        };

        fetchTvShowDetails();
    }, [tvshowId]);

    if (!tvShowDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="section">
                <div className="columns">
                    <div className="column is-one-third">
                        <img src={tvShowDetails.imgURL} alt={tvShowDetails.title} />
                    </div>
                    <div className="column">
                        <h1 className="title">{tvShowDetails.title}</h1>
                        <p><strong>Year:</strong> {tvShowDetails.year}</p>
                        <p><strong>Episode Count:</strong> {tvShowDetails.episodeCount}</p>
                        <p><strong>Genres:</strong> {tvShowDetails.genres.map(genre => genre.name).join(", ")}</p>
                        <p><strong>Studio:</strong> {tvShowDetails.studio.name}</p>
                        <p><strong>Description:</strong> {tvShowDetails.plot}</p>
                    </div>
                </div>
            </div>
            <div className="section">
                <audio controls>
                    <source src={tvShowDetails.audioURL} type="audio/mp3" />
                </audio>
            </div>
            <div className="section">
                <h2 className="subtitle">Cast</h2>
                <div className="columns" style={{ overflow: "auto", display: "flex" }}>
                    {tvShowDetails.roles.map(role => (
                        <div key={role.roleId} className="column is-2">
                            <div className="actor">
                                <img src={role.imgURL} alt={role.character} />
                                <p><strong>{role.character}</strong> - {role.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="section">
                <h2 className="subtitle">Seasons</h2>
                <div className="columns" style={{ overflowX: "auto", display: "flex" }}>
                    {tvShowDetails.seasons.map(season => (
                        <div key={season.seasonId} className="column is-2">
                            <Link to={`/Season/${season.seasonId}`}>
                                <div className="season">
                                    <img src={season.imgURL} alt={`Season ${season.number}`} />
                                    <p><strong>Season {season.number}</strong> - {season.episodeCount} episodes</p>
                                </div>
                            </Link>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}