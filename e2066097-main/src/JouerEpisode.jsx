import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const JouerEpisode = () => {
    const { episodeId } = useParams();
    const [episodeInfo, setEpisodeInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function fetchEpisodeInfo() {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) {
                    throw new Error("User not authenticated");
                }
                
                const response = await fetch(`https://tvshowdbapi.herokuapp.com/viewepisode?episodeId=${episodeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error("Failed to fetch episode information");
                }
                
                const data = await response.json();
                setEpisodeInfo(data);
            } catch (error) {
                console.error("Error fetching episode information:", error);
                setErrorMessage("Failed to fetch episode information");
            }
        }

        fetchEpisodeInfo();
    }, [episodeId]);

    if (!sessionStorage.getItem("token")) {
        return (
            <div>
                <p style={{ textAlign: "center", fontSize: "2em", fontWeight: "bold" }}><b>Please <a href="/login">login</a> to watch videos ! </b></p>
            </div>
        );
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    if (!episodeInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Watch Episode</h2>
            <video controls>
                <source src={episodeInfo.videoURL} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default JouerEpisode;
