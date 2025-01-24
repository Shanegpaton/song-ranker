import React, { useState } from 'react';
import styles from './SongOption.module.css';
import { FaUserCircle } from 'react-icons/fa';

function SongOption(props) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelect = (item) => {
        setSelectedItem(item.id);
        props.sendItem(item);
    };

    return (
        <>
            {props.options.map((item) => (
                <div
                    key={item.id}
                    className={`${styles.item} ${selectedItem === item.id ? styles.selected : ''}`}
                    onClick={() => handleSelect(item)}
                >
                    {props.type !== 'Song' && item.images && item.images[0] ? (
                        <img
                            src={item.images[0].url}
                            alt={item.name}
                            className={styles.image}
                        />
                    ) : props.type !== 'Song' ? (
                        <FaUserCircle className={styles.image} />
                    ) : (
                        item.album.images && item.album.images[0] ? (
                            <img
                                src={item.album.images[0].url}
                                alt={item.name}
                                className={styles.image}
                            />
                        ) : (
                            <FaUserCircle className={styles.image} />
                        )
                    )}

                    <div className={styles.name}>
                        <h2 className={styles.title}>{item.name}</h2>
                        {(props.type === 'Album' || props.type === 'Song') && (
                            <div className={styles.artists}>
                                {item.artists.map((artist, index) => (
                                    index === 0 ? (
                                        <p key={artist.id}>{artist.name}</p>
                                    ) : (
                                        <p key={artist.id}>, {artist.name}</p>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default SongOption;
