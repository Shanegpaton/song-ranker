import "./song.css";
function Song(props) {


    return (
        <section className="song-container">
            <h2>{props.rank}</h2>
            <p>{props.name}</p>
            <p>{props.artist}</p>
            <p>{props.length}</p>

        </section >
    )
}
export default Song