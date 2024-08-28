import "../styles/Game.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Modal } from "react-bootstrap";
import { GuessRequest } from "../request/GuessRequest";
import { GuessResponse } from "../request/GuessResponse";
import Keyboard from "../gameElements/Keyboard";
import Grid from "../gameElements/Grid";
import {parseUserJson, User} from "../request/User";
import { ChangeLengthRequest } from "../request/ChangeLengthRequest";
import Swal from "sweetalert2";
import { ChangeListRequest } from "../request/ChangeListRequest";
import { ShowHintRequest } from "../request/ShowHintRequest";
import { ShowHintResponse } from "../request/ShowHintResponse";
import { AudioManager } from "../resources/AudioManager";
import {InitGameRequest} from "../request/InitGameRequest";
import {InitGameResponse} from "../request/InitGameResponse";
import {useNavigate} from "react-router-dom";
import {backendAddress} from "../util";
import {BaseRequest} from "../request/BaseRequest";

let aiReady = true;

/**
 * The Game component
 * It contains the header, the grid, and the modal for the how to play page.
 * It also handles the game state and the logic for submitting guesses.
 */
const Game: React.FC = () => {
  const navigate = useNavigate();
  const [wordLength, setWordLength] = useState(5);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hint, setHint] = useState({ index: 0, letter: "" });
  const [hintWord, setHintWord] = useState("");
  const [gameRes, setGameRes] = useState<GuessResponse>({
    numGuesses: 0,
    isValid: false,
    isGameEnd: false,
    isCorrectWord: false,
    letterStatuses: [],
  });
  const [keyPressed, setKeyPressed] = useState({inputChar: "", key: 0});
  const [prevGame, setPrevGame] = useState(Array<GuessResponse>)
  const [gameReset, setGameReset] = useState(0)
  const [resetBtnSpin, setResetBtnSpin] = useState(0)
  const [hintReady, setHintReady] = useState(true)


  let user: User
  let userRaw = localStorage.getItem("user");
  if (userRaw) {
    user = parseUserJson(userRaw);
  }

  useEffect(() => {
    if(!userRaw){
      navigate("/")
    }
  }, []);


  /**
   * Submits a guess to the server and updates the game state based on the response.
   * If the guess is invalid, it adds a shake animation to the current row.
   * If the maximum number of attempts has been reached or the guess is valid, it ends the game.
   *alerts
   * invalid word focus
   * correct word animation
   * letter enter animetion
   * @param word The guessed word.
   */
  const submitGuess = async (word: GuessRequest) => {
    const guess = word;
    guess.user = user
    // one line added to fix the shake animation
    await axios.post(backendAddress() + "guess", guess).then((res) => {
      setGameRes(GuessResponse.fromAxiosResponse(res.data));
    });
  };

  useEffect(() => {
    const audioManager = AudioManager.getInstance();
    // Invalid guess message
    if (gameRes && !gameRes.isValid && gameRes.letterStatuses == null) {
      Swal.fire({
        width: 250,
        position: "top",
        title: "Invalid word",
        showConfirmButton: false,
        timer: 1000,
      });
    }

    // Alerts for invalid word and game end (lost or won)
    if (gameRes.isGameEnd && gameRes.isValid) {
      setTimeout(() => {
        if (gameRes.isCorrectWord) {
          audioManager.playVictorySound();
          Swal.fire({
            width: 350,
            position: "top",
            icon: "success",
            title: "Congratulations!",
            showConfirmButton: false,
            timer: 2000,
          });
        //   do not allow for any input after the game ends
        //   const inputs = document.querySelectorAll("input");
        //   inputs.forEach((input) => (input.disabled = true));

        } else {
          audioManager.playLossSound();
          //   creat a sweetalert
          Swal.fire({
            width: 350,
            position: "top",
            icon: "error",
            title: "You Lost..Try again!",
            showConfirmButton: false,
            timer: 2000,
          });
          // const inputs = document.querySelectorAll("input");
          // inputs.forEach((input) => (input.disabled = true));
        }
        // disable the input fields
        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => (input.disabled = true));
      }, 1430);
    }
  }, [gameRes]);

  /**
   * Toggles the 'showHint' state variable.
   * If 'showHint' is currently true, it will be set to false, and vice versa.
   */
  const toggleModal = () => {
    setShowHint(!showHint);
  };

  /**
   * This function is called when the AI button is clicked.
   * Generates a hint for the user using the AI.
   * The AI tries to play the game.
   */
  const aiGenerate = async () => {
    if (gameRes.isGameEnd || !aiReady) {
      return;
    }

    aiReady = false;

    await axios.post(backendAddress() + "get-ai-hint", new ShowHintRequest(user))
        .then(async (res) => {
          const hintWord = ShowHintResponse.fromAxiosResponse(res.data).hint;
          setHintWord(hintWord);

          // Populate the current row with the hint word
          const rowIndex = gameRes.numGuesses;
          const gridRow = document.querySelector(`.grid-row:nth-child(${rowIndex + 1})`);
          const cells = Array.from(gridRow?.querySelectorAll(".grid-cell") || []);
          for (let i = 0; i < hintWord.length && i < cells.length; i++) {
            (cells[i] as HTMLInputElement).value = hintWord[i].toUpperCase();
          }

          // Move focus to the last cell
          const lastCell = cells[cells.length - 1] as HTMLInputElement;
          if (lastCell) {
            lastCell.focus();
          }
          await submitGuess(new GuessRequest(user, hintWord.toUpperCase()));
        })
        .catch((error) => {
          console.error("Error getting hint from backend:", error);
        });

    aiReady = true;
  };



  /**
   * Shows a hint to the user.
   * the hint is a letter from the word to guess.
   * The user can use up to 3 hints.
   * If the user has used all 3 hints, the hint button will be disabled.
   */
  const requestHint = () => {
    if (gameRes.isGameEnd) {
      return;
    }

    if(hintReady){
      if (hintsUsed < 3) {
        setHintReady(false)
        setHintsUsed(hintsUsed + 1);
        const hint = new ShowHintRequest(user);

        axios
            .post(backendAddress() + "get-hint", hint)
            .then((res) => {
              const hintWord = ShowHintResponse.fromAxiosResponse(
                  res.data
              ).hint.toUpperCase();
              setHint({ index: hintsUsed, letter: hintWord });
            })
            .catch((error) => {
              console.error("Error fetching hint:", error);
            });
        // Added event listener to remove color when hint letter is deleted
      } else {
        // Pop up error message when the user has used all 3 hints
        Swal.fire({
          width: 350,
          position: "top",
          icon: "error",
          title: "You've run out of hints \nHint used: " + hintsUsed + "/3",
          showConfirmButton: false,
          timer: 1200,
        });
      }
    }

  };

  useEffect(() => {
    setTimeout(() => {
      setHintReady(true)
    }, 500);
  }, [hint]);



  const increaseSize = () => {
    let s: number = wordLength + 1 !== 10 ? wordLength + 1 : 9;

    if (s !== wordLength) {
      submitChangeLength(new ChangeLengthRequest(user, s));
    }
  };

  const decreaseSize = () => {
    let s: number = wordLength - 1 !== 1 ? wordLength - 1 : 2;

    if (s != wordLength) {
      submitChangeLength(new ChangeLengthRequest(user, s));
    }
  };

  const submitChangeLength = (size: ChangeLengthRequest) => {
    setKeyPressed({inputChar: "", key: 0})
    setGameReset(gameReset+1)
    setHint({ index: 0, letter: "" });
    setHintWord("")
    setHintsUsed(0);
    setWordLength(size.size);
    setGameRes({
      numGuesses: 0,
      isValid: false,
      isGameEnd: false,
      isCorrectWord: false,
      letterStatuses: [],
    });
    setShowHint(false);
    setPrevGame(new Array<GuessResponse>)

    size.user = user;

    axios.post(backendAddress() + "sizechange", size).then();
  };

  /**
   * Submits a request to change the word
   * @param file The file to read the  word from
   */
  const submitChangeList = (file: ChangeListRequest) => {
    setWordLength(file.file[0].length);
    setHintWord("")
    setGameRes({
      numGuesses: 0,
      isValid: false,
      isGameEnd: false,
      isCorrectWord: false,
      letterStatuses: [],
    });
    setShowHint(false);
    setPrevGame(new Array<GuessResponse>)

    file.user = user;

    axios.post(backendAddress() + "wordchange", file).then();
  };

  /**
   * Handles the keyboard input
   * @param input the input from the keyboard
   */
  const keyboardInput = (input: string)=>{
    setKeyPressed({inputChar: input, key: keyPressed.key+1})
  }

  const reset = ()=>{
    setKeyPressed({inputChar: "", key: 0})
    setGameReset(gameReset+1)
    setHint({ index: 0, letter: "" });
    setHintWord("")
    setHintsUsed(0);
    setGameRes({
      numGuesses: 0,
      isValid: false,
      isGameEnd: false,
      isCorrectWord: false,
      letterStatuses: [],
    });
    setShowHint(false);
    setPrevGame(new Array<GuessResponse>)
    axios.post(backendAddress() + "reset-game", new BaseRequest(user)).then();
  }

  let [isLoaded, setLoaded] = useState(false)
  useEffect(() => {
    if (!isLoaded && userRaw) {
      isLoaded = true;
      setLoaded(true)
      const req = new InitGameRequest(user);
      let response : InitGameResponse;
      axios.post(backendAddress() + "init-game", req).then((res) => {
        response = (InitGameResponse.fromAxiosResponse(res.data));

        setWordLength(response.wordLength)
        let lastRes = response.prevGuesses.slice(-1)
        if(lastRes){
          let lastRes1 = lastRes.at(0)
          if(lastRes1){
            setGameRes(lastRes1)
          }
        }
        setPrevGame(response.prevGuesses)
      });
    }
  }, []);

  return (
    <>
      <div className="game-header">
        {/*hint-button*/}
        <button className="hint-btn" onClick={requestHint}>
          <span className="text">Hint: {3 - hintsUsed} </span>
        </button>
        {/*AI-BUTTON*/}
        <button className="ai-btn" onClick={aiGenerate}>
          <svg
              height="24"
              width="24"
              fill="#FFFFFF"
              viewBox="0 0 24 24"
              data-name="Layer 1"
              id="Layer_1"
              className="sparkle"
          >
            <path
                d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,
                    21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,
                    20.5,0,19.333,2.333,17,3.5Z"
            ></path>
          </svg>
          <span className="text">AI</span>
        </button>
        {/*<div className="game-container">*/}
        {/*  /!* Button to start the timer *!/*/}
        {/*  <button onClick={startTimer} disabled={timerRunning}>*/}
        {/*    Start 20-Second Timer*/}
        {/*  </button>*/}

        {/*  /!* Display the remaining time *!/*/}
        {/*  {timerRunning && <p>Time Remaining: {timeRemaining} seconds</p>}*/}
        {/*</div>*/}

        <p className={"guess-left"}>
          Guesses left: {Math.max(0, 6 - gameRes.numGuesses)}
        </p>
        <div className="header-text"> Wordle</div>

        <button className="size-btn" onClick={decreaseSize}>
          <span className="text">-</span>
        </button>

        <span className="size-text">{wordLength}</span>

        <button className="size-btn" onClick={increaseSize}>
          <span className="text">+</span>
        </button>

        <button className="how-to-play-btn" onClick={toggleModal}>
          <img src={require("../resources/hint.png")} alt=""/>
        </button>

        <div className="reset-btn-container">
          <button
            className="reset-btn"
            onClick={() => {
              reset();
              setResetBtnSpin(1);
            }}
            onAnimationEnd={() => setResetBtnSpin(0)}
            data-spin={resetBtnSpin}
          />
        </div>

        {/*modal to display the how to play page*/}
        <div>
          <Modal
              show={showHint}
              onHide={toggleModal}
              centered
              className="overlay"
          >
            <Modal.Header>
              <Button className="close-modal" onClick={toggleModal}>
                {" "}
                Close{" "}
              </Button>
            </Modal.Header>
            <Modal.Body className="modal-content">
              <img
                  className={"modal-img"}
                  src={require("../resources/how_to_play.png")}
                  alt=""
              />
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <Container className="game-container" key={gameReset}>
        <div>
          <Grid
              hint={hint}
              submitGuess={submitGuess}
              wordLength={wordLength}
              totalGuesses={6}
              prevRes={prevGame}
              res={gameRes}
              isGameEnd={gameRes.isGameEnd}
            input={keyPressed}
          />
        </div>
        <div>
          <Keyboard
            onInput={keyboardInput}
            letterStatuses={gameRes.letterStatuses}
            prevGame={prevGame}
          />
        </div>
      </Container>
    </>
  );
};

export default Game;
