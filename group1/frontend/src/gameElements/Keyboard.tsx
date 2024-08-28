import React, { useEffect } from "react";
import "../styles/Keyboard.css";
import { Container, Button } from "react-bootstrap";
import { KeyboardButton } from "./KeyboardButton";
import { Accuracy, LetterStatus } from "../request/LetterStatus";
import {GuessResponse} from "../request/GuessResponse";

/**
 * The props for the on-screen Keyboard
 */
interface IKeyboardProps {
  letterStatuses: LetterStatus[];
  prevGame: Array<GuessResponse>;
  onInput: (input: string) => void;
  // handleBackspace: () => void;
  // handleLetterClick: (letter: string) => void;
}

/**
 * Renders the keyboard component.
 * @param {IKeyboardProps} props - The props for the Keyboard component.
 * @returns {React.ReactElement} The rendered Keyboard component.
 */
function Keyboard(props: IKeyboardProps): React.ReactElement {
  const keyboard_letters = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  useEffect(() => {
    if (props.prevGame && props.prevGame.length>0){
      for (const guess of props.prevGame) {
        handleUpdate(guess.letterStatuses)
      }
    }
  }, [props.prevGame]);

  useEffect(() => {
    handleUpdate(props.letterStatuses);
  }, [props.letterStatuses]);

  /**
   * Updates the keyboard based on the letter statuses.
   */
  const handleUpdate = (letters : LetterStatus[]) => {
    if (letters) {
      letters.forEach((status) => {
        // Find key that matches letter
        const key = document.getElementById(status.letter.toLowerCase());
        if (key) {
          const computedStyle = window.getComputedStyle(key);

          if (status.accuracy === Accuracy.Correct) {
            key.style.backgroundColor = "#4ea64e";
          }else if (
              status.accuracy === Accuracy.Misplaced &&
              computedStyle.backgroundColor !== "rgb(78, 166, 78)"
          ) {
            key.style.backgroundColor = "#a4a42e";
          }else if (status.accuracy === Accuracy.Wrong &&
              computedStyle.backgroundColor !== "rgb(78, 166, 78)" &&
              computedStyle.backgroundColor !== "rgb(164, 164, 46)") {
            key.style.backgroundColor = "darkgrey";
          }
        }
      });
    }
  };

  return (
    <Container className="keyboard">
      {keyboard_letters.map((row) => (
        <div className="line">
          {row.map((letter) => (
            <KeyboardButton
            onButtonClick={props.onInput}>{letter}</KeyboardButton>
          ))}
        </div>
      ))}
      <div className="line special">
        <Button
          className={`keyboard-button special`}
          key="Enter"
          onClick={() => props.onInput("Enter")}
        >
          Enter
        </Button>
        <Button
          className={`keyboard-button special`}
          key="Backspace"
          onClick={() => props.onInput("Backspace")}
        >
          ⌫
        </Button>
      </div>
    </Container>
  );
}

export default Keyboard;
