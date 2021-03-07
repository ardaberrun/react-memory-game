import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import backgroundImage from "./assets/background.jpg";
import cardBack from "./assets/cardback.jpg";


function App() {
  const [fetchedCharacters, setFetchedCharacters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [flippedCard, setFlippedCard] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flips, setFlips] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [timeControl, setTimeControl] = useState(false);

  useEffect(() => {
    if (timeControl) {
      let interval = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        }
        if (timeLeft === 0 || matched.length === characters.length ) {
          setTimeControl(false);
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [matched,characters,timeControl, timeLeft]);

  useMemo(() => {
    if (fetchedCharacters.length === 0) {
      fetch("http://hp-api.herokuapp.com/api/characters")
        .then((res) => res.json())
        .then((data) => setFetchedCharacters(data))
        .catch((err) => console.log(err));
    }
  }, [fetchedCharacters]);

  useMemo(() => {
    if (characters.length === 0 && fetchedCharacters.length !== 0) {
      const filtered = fetchedCharacters
        .sort(() => Math.random() - 0.5)
        .filter((_, i) => i < 6);
      setCharacters([...filtered, ...filtered]);
    }
  }, [characters, fetchedCharacters]);

  useEffect(() => {
    if (flippedCard.length === 2) {
      if (characters[flippedCard[0]] === characters[flippedCard[1]]) {
        setMatched(prevMatched => [...prevMatched, flippedCard[0], flippedCard[1]]);
      }
      setTimeout(() => setFlippedCard([]), 800);
    }
  }, [characters, flippedCard]);

  const handleFlip = (idx) => {
    setTimeControl(true);
    setFlips(flips + 1);
    setFlippedCard((flipped) => [...flipped, idx]);
  };

  const restartGame = () => {
    setFetchedCharacters([]);
    setCharacters([]);
    setFlippedCard([]);
    setMatched([]);
    setFlips(0);
    setTimeLeft(25);
    setTimeControl(false);
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {!timeLeft ? (
        <div
          className="popup-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="popup">
            <h3 className="popup-title">YOU LOST!</h3>
            <button onClick={restartGame} className="popup-button">Restart</button>
          </div>
        </div>
      ) : 
      (matched.length === characters.length && matched.length !== 0) ?  (   
        <div
          className="popup-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div className="popup" >
            <h3 className="popup-title">YOU WON!</h3>
            <button onClick={restartGame} className="popup-button">Restart</button>
          </div>
        </div>
      ) : null}
      <div className="name">
        <h1 className="title">MEMORY GAME</h1>
      </div>
      <div className="game">
        <div className="game-info">
          <h3 className="info">Flips : {flips}</h3>
          <br /> <br />
          <br /> <br />
          <h3 className="info">Time : {timeLeft}</h3>
        </div>
        <div className="game-board">
          {characters.map((character, idx) => {
            let flip = false;
            if (flippedCard.includes(idx)) flip = true;
            if (matched.includes(idx)) flip = true;

            return (
              <div
                className="card"
                key={idx}
                onClick={() => flippedCard.length < 2 && handleFlip(idx)}
              >
                <div className={`card-inner ${flip ? "flip" : ""}`}>
                  <div className="card-front">
                    <img className="image" src={cardBack} alt="card" />
                  </div>
                  <div className="card-back">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="image"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
