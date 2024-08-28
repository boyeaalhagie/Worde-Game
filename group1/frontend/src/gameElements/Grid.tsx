import "../styles/Grid.css";
import React, {createRef, useEffect} from "react";
import {Row} from "react-bootstrap";
import {GuessResponse} from "../request/GuessResponse";
import {Accuracy} from "../request/LetterStatus";
import { AudioManager } from "../resources/AudioManager";
import { GuessRequest } from "../request/GuessRequest";
import { NamedUser } from "../request/User";

interface IGridProps {
  submitGuess: (word: GuessRequest) => void;
  wordLength: number;
  totalGuesses: number;
  prevRes: Array<GuessResponse>;
  //The response from backend containing the status of each letter
  res: GuessResponse;
  isGameEnd: boolean;
  hint: { index: number; letter: string };
  input: {inputChar: string, key: number};
}

/**
 * The Grid component for the game
 * @param props The props for the Grid component
 * @return The rendered Grid component
 */
export default function Grid(props: IGridProps) : React.ReactElement {
    const [gameOver, setGameOver] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(0);
    const [currentCell, setCurrentCell] = React.useState(0);


    /**
     * Representation of every currently existing grid cell
     */
    const inputRefs = Array.from({length: props.totalGuesses}, () =>
        Array.from({length: props.wordLength}, () => createRef<HTMLInputElement>())
    );

    useEffect(() => {
        handleResFocus();
        handleUpdate();
    }, [props.res]);

    useEffect(() => {
        //Init From prev game
        if(props.prevRes && props.prevRes.length>0){
            let row = currentRow
            for (const guess of props.prevRes) {

                //Valid word animation
                if (guess && guess.letterStatuses) {
                    const {letterStatuses} = guess;
                    let Letters = "";

                    letterStatuses.forEach((status, index) => {
                        const accuracy = status.accuracy;
                        if (inputRefs[row][index] && inputRefs[row][index].current) {
                            const gridCell = inputRefs[row][index].current;


                            if (gridCell) {
                                gridCell.value = status.letter.toUpperCase()
                                // Add a delay to the animation based on the index of the cell
                                gridCell.style.animationDelay = `${index * 0.1}s`;
                                gridCell.classList.add("flip");

                                gridCell.addEventListener(
                                    "animationend",
                                    () => {
                                        gridCell.classList.remove("flip");

                                        // Move the color change into the animationend event listener
                                        if (accuracy == Accuracy.Correct) {
                                            gridCell.style.backgroundColor = "#4ea64e";
                                            Letters += gridCell.value;
                                        } else if (accuracy == Accuracy.Misplaced) {
                                            gridCell.style.backgroundColor = "#a4a42e";
                                            Letters += gridCell.value;
                                        } else {
                                            gridCell.style.backgroundColor = "darkgrey";
                                        }
                                    },
                                    {once: true}
                                );
                            }
                        }
                    });
                }
                row = (row + 1)
            }
            setCurrentRow(row)
        }
        resetFocus();
    }, [props.prevRes]);



    useEffect(() => {
        resetFocus();
    }, [currentRow, currentCell])

    useEffect(() => {
        showHint();
    }, [props.hint]);

    useEffect(() => {
        if(!props.isGameEnd) {
            handleKeyDown(null, props.input.inputChar).then()
            handleType(props.input.inputChar)
        }
    }, [props.input]);


    /**
     * Gets the correct letter for the currently selected cell from backend, then displays it
     */
    const showHint = () => {
        const gridCell = inputRefs[currentRow][currentCell].current;
        if (gridCell && props.hint.letter != "") {
            // Add a delay to the animation based on the index of the cell
            gridCell.style.animationDelay = `${0}s`;
            gridCell.classList.add("flip");

            gridCell.addEventListener(
                "animationend",
                () => {
                    gridCell.classList.remove("flip");

                    gridCell.style.backgroundColor = "#4ea64e";

                    gridCell!.value = props.hint.letter.charAt(currentCell)

                    gridCell.addEventListener("input", (event) => {
                        const input = event.target as HTMLInputElement;
                        if (input.value === "") {
                            input.classList.remove("filled");
                            input.setAttribute("style", "");
                        }
                    });

                    if (currentCell != props.wordLength - 1) {
                        setCurrentCell(currentCell + 1)
                    }

                },
                {once: true}
            );
        }
    }

    /**
     * Handles the update of the grid cells based on the response from the server.
     * For each letter in the response, it adds a flip animation to the corresponding grid cell.
     * After the animation ends, it changes the background color of the grid cell based on the accuracy of the letter.
     */
    const handleUpdate = () => {
        let audioManager = AudioManager.getInstance();
        //Valid word animation
        if (props.res && props.res.letterStatuses) {
            
            if (props.isGameEnd) {
                //   disable the cursor
                setGameOver(true);
            }


            const {letterStatuses} = props.res;

            letterStatuses.forEach((status, index) => {
                const accuracy = status.accuracy;
                if (inputRefs[currentRow][index] && inputRefs[currentRow][index].current) {
                    const gridCell = inputRefs[currentRow][index].current;


                    if (gridCell) {
                        // Add a delay to the animation based on the index of the cell
                        gridCell.style.animationDelay = `${index * 0.3}s`;
                        gridCell.classList.add("flip");

                        gridCell.addEventListener(
                            "animationend",
                            () => {
                                gridCell.classList.remove("flip");

                                // Move the color change into the animationend event listener
                                if (accuracy == Accuracy.Correct) {
                                    gridCell.style.backgroundColor = "#4ea64e";
                                    audioManager.playRightLetterSound();
                                } else if (accuracy == Accuracy.Misplaced) {
                                    gridCell.style.backgroundColor = "#a4a42e";
                                    audioManager.playWrongLetterSound();
                                } else {
                                    gridCell.style.backgroundColor = "darkgrey";
                                    audioManager.playWrongLetterSound();
                                }
                            },
                            {once: true}
                        );
                    }
                }
            });
        }

        if (props.res && !props.res.isValid && props.res.letterStatuses == null) {//Invalid word animation

            for (let step = 0; step < props.wordLength; step++) {
                const gridCell = inputRefs[currentRow][step].current;
                if (gridCell) {
                    gridCell.classList.add("shake");

                    setTimeout(() => {
                        gridCell.classList.remove("shake");
                    }, 1000);
                }
            }
        }

        if (props.res && props.res.isCorrectWord) {//Correct word animation
            for (let step = 0; step < props.wordLength; step++) {
                const gridCell = inputRefs[currentRow][step].current;
                if (gridCell) {
                    gridCell.classList.add("right-word");
                    setTimeout(() => {
                        gridCell.classList.remove("right-word");
                    }, 1000);
                }
            }
        }
    };

    /**
     * Handles the focus of the grid cells based on the response from the server
     */
    const handleResFocus = () => {
        if (props.res.isValid) {
            if (currentRow < props.totalGuesses - 1) {
                setCurrentRow(currentRow + 1);
                setCurrentCell(0);
            } else if (currentRow === props.totalGuesses - 1) {
                if (props.isGameEnd) {
                    //   disable the cursor
                    setGameOver(true);
                    setCurrentRow(currentRow);
                }

            }
        }

    }


    /**
     * Handles the input event for typing a grid cell.
     * @param event The input event.
     */
    const handleInput = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        const inputElement = event.currentTarget;

        //If valid letter
        if (/^[A-Z]$/i.test(inputElement.value)) {
            inputElement.value = inputElement.value.toUpperCase();
            inputElement.classList.add("letter-enter");
            inputElement.addEventListener(
                "animationend",
                () => {
                    inputElement.classList.remove("letter-enter");
                },
                {once: true}
            );

            if (currentCell < props.wordLength - 1) {
                setCurrentCell(currentCell + 1);
            }

        } else {
            inputElement.value = "";
        }
    };


    /**
     * Handles typing from on screen keyboard
     * @param letter letter typed
     */
    const handleType = (
        letter: string,
    ) => {
        const inputElement = inputRefs[currentRow][currentCell].current

        if (!inputElement) {
            return
        }

        if (letter.length != 1) {
            return
        }

        //If valid letter
        if (letter.length == 1 && /^[A-Z]$/i.test(letter)) {
            inputElement.value = letter.toUpperCase();
            inputElement.classList.add("letter-enter");
            inputElement.addEventListener(
                "animationend",
                () => {
                    inputElement.classList.remove("letter-enter");
                },
                {once: true}
            );

            if (currentCell < props.wordLength - 1) {
                setCurrentCell(currentCell + 1);
            }

        } else {
            inputElement.value = "";
        }
    };

    /**
     * Handle the keydown event for enter and backspace
     * @param event The input event.
     * @param key string
     */
    const handleKeyDown = async (
        event: any, key: string
    ) => {

        let input: string
        if (event) {
            input = event.key
        } else {
            input = key
        }

        if (input === "Enter" && inputRefs[currentRow][currentCell].current!.value !== "") {
            if (currentCell === props.wordLength - 1) {
                // check if the word is valid
                props.submitGuess(newGuessRequest());
            }
        }

        if (input === "Backspace" && currentCell > 0 && inputRefs[currentRow][currentCell].current!.value == "") {
            //If last letter is empty or not on last letter
            if (event) {
                event.preventDefault();
            }
            inputRefs[currentRow][currentCell - 1].current!.value = "";
            inputRefs[currentRow][currentCell - 1].current!.setAttribute("style", "");
            setCurrentCell(currentCell - 1)
        } else if (input === "Backspace" && currentCell === props.wordLength - 1) {
            //If on last letter and it contains letter
            if (event) {
                event.preventDefault();
            }
            inputRefs[currentRow][currentCell].current!.value = "";
            inputRefs[currentRow][currentCell - 1].current!.setAttribute("style", "");
        }

        // prevent the default behavior for the arrow keys to avoid
        // user from changing inputs not in the current row using the arrow keys
        if (
            event && (
                event.key === "ArrowLeft" ||
                event.key === "ArrowRight" ||
                event.key === "ArrowUp" ||
                event.key === "ArrowDown")
        ) {
            event.preventDefault();
        }
    };

const newGuessRequest = () => {
    let word = inputRefs[currentRow].map((ref) => ref.current!.value).join("");

    // Create a new GuessRequest object
    return new GuessRequest(
        //User gets replaced later
        new NamedUser("dummy"),
        word
    );
};

    /**
     * Refocuses on the correct grid cell
     */
    const resetFocus = () => {
        if(!props.isGameEnd){
            setTimeout(() => {
                inputRefs[currentRow][currentCell].current?.focus();
            }, 0);
        }
    };


    return(
        <Row>
            <div>
                {inputRefs.map((row, rowIndex) => (
                    <div className="grid-row" key={rowIndex}>

                        {row.map((ref, colIndex) => (
                            <input
                                ref={ref}
                                className={`grid-cell`}
                                maxLength={1}
                                key={colIndex}
                                onInput={(event) =>
                                    handleInput(event as any)
                                }
                                onKeyDown={(event) => handleKeyDown(event, "")}
                                onChange={(event) => {
                                    const letter = event.target.value.toUpperCase();
                                    if (!/^[A-Z]$/.test(letter)) {
                                        event.target.value = "";
                                    }
                                }}
                                onBlur={() => resetFocus()}
                                disabled={gameOver}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </Row>
    );
}
