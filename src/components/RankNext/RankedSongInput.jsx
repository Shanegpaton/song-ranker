import React, { useState } from "react";

const RankedSongInput = ({ rankedSongList, addSongAtRank }) => {
  const [rank, setRank] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      setError("Please enter a valid number.");
      return;
    }

    setRank(value);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericRank = parseInt(rank, 10);

    if (isNaN(numericRank)) {
      setError("Please enter a number.");
      return;
    }

    if (numericRank < 1 || numericRank > rankedSongList.length + 1) {
      setError(`Rank must be between 1 and ${rankedSongList.length + 1}.`);
      return;
    }
    addSongAtRank(numericRank - 1);
    setRank("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="rankInput">Enter Song Rank:</label>
      <input
        type="number"
        id="rankInput"
        value={rank}
        onChange={handleInputChange}
        min="1"
        max={rankedSongList.length + 1} // Dynamically limit input
        required
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Add Song</button>
    </form>
  );
};

export default RankedSongInput;
