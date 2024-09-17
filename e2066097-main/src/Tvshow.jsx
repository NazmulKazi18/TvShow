import { Link, useNavigate } from "react-router-dom";

export function Tvshow(props) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`/details/${props.tvshow.tvshowId}`);
    }
    
    return (
        <div className="column is-3-desktop is-4-tablet is-6-mobile">
            <Link to={`/Details/${props.tvshow.tvshowId}`} aria-label={`View details of ${props.tvshow.title}`}>
                <div className="card" onClick={handleClick}>
                    <div className="card-image">
                        <figure className="image is4by3">
                            <img src={props.tvshow.imgURL} alt={props.tvshow.title} />
                        </figure>
                    </div>
                    <div className="card-content">
                        <div className="content">
                            <h3 className="title is-3 has-text-centered">{props.tvshow.title}</h3>
                            <div className="tvshows-info">
                                <div className="info-item">
                                    <span className="info-label"><b>Studio: </b></span>
                                    <span className="info-value">{props.tvshow.studio.name}</span><br></br>
                                    <span className="info-label"><b>Genres: </b></span>
                                    <span className="info-value">{props.tvshow.genres.map((g) => g.name).join(", ")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
