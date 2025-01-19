import React from 'react';
import styles from './SongOption.module.css'; // Import the CSS module

function SongOption(props) {
    const options = props.options;


    return (
        <>
            {options.map((item) => (
                <div key={item.id} className={styles.item}>
                    {props.type !== 'Song' && (
                        <img
                            src={item.images[1].url}
                            alt={item.name}
                            className={styles.image} image
                        />
                    )}
                    {props.type === 'Song' && (
                        <img
                            src={item.album.images[1].url}
                            alt={item.name}
                            className={styles.image}
                        />
                    )}
                    <h2 className={styles.title}>{item.name}</h2>
                    {(props.type === 'Album' || props.type === 'Song') && (
                        <div className={styles.artists}>
                            {item.artists.map((artist, index) => (
                                (index === 0) ? < p key={artist.id} > {artist.name}</p> : <p key={artist.id}>, {artist.name}</p>
                            ))}
                        </div>
                    )}
                </div >
            ))
            }
        </>
    );
}

export default SongOption;
