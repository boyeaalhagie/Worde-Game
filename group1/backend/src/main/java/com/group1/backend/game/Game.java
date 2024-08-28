package com.group1.backend.game;

import com.group1.backend.request.GuessResponse;
import com.group1.backend.user.User;
import com.group1.backend.util.ValidGuess;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Represents a game of Wordle
 */
public class Game {
    public static final int MAX_GUESSES = 6;
    private User user;

    private final String correctWord;
    private List<String> exclusionWords;
    private List<ValidGuess> guesses;
    private List<Character> lettersUsed;

    private List<GuessResponse> guessResponses;
    private int numGuesses;
    private int wordLength;
    private boolean isComplete;
    private boolean isWon;

    private Dictionary dict;

    /**
     * Create a new game that is associated with a user and has a correct word
     * @param user the user playing the game
     * @param correctWord the correct word
     */
    public Game(User user, String correctWord) {
        this.user = user;
        this.wordLength = correctWord.length();
        assertValidWordLength(wordLength);

        this.correctWord = correctWord;
        this.lettersUsed = new ArrayList<>(26);
        this.guesses = new ArrayList<>();
        this.exclusionWords = new ArrayList<>();
        this.guessResponses = new ArrayList<>();

        this.isComplete = false;
        this.isWon = false;

        dict = new Dictionary();
        dict.importVocab("src/main/resources/"+(wordLength)+"_letter_words.txt");
    }

    /**
     * Create a new game that is associated with a user and has a correct word of a certain length
     * @param user the user playing the game
     * @param wordLength the length of the correct word
     */
    public Game(User user, int wordLength) {
        this.user = user;
        this.wordLength = wordLength;
        assertValidWordLength(wordLength);

        dict = new Dictionary();
        dict.importVocab("src/main/resources/"+(wordLength)+"_letter_words.txt");

        this.correctWord = dict.getRandomWord();
        this.lettersUsed = new ArrayList<>(26);
        this.guesses = new ArrayList<>();
        this.exclusionWords = new ArrayList<>();
        this.guessResponses = new ArrayList<>();

        this.isComplete = false;
        this.isWon = false;
    }

    private void assertValidWordLength(int wordLength) {
        if (wordLength < 2 || wordLength > 9) {
            throw new IllegalArgumentException("Invalid word length: " + wordLength);
        }
    }

    /**
     * Update a Game's dictionary
     * @param words List of words to use
     */
    public void updateDict(List<String> words){
        dict.changeVocab(words);
    }

    /**
     * Update a Game's dictionary with preset dict
     * @param length Length of words
     */
    public void updateDict(int length){
        wordLength = length;
        dict.importVocab("src/main/resources/"+(length)+"_letter_words.txt");
    }

    /**
     * Add exclusion words
     * @param words Words to exclude
     */
    public void addExclusion(List<String> words){
        dict.addExclusionWords(words);
    }

    /**
     * Use this constructor for testing purposes only where there is no need to save user data
     * @param correctWord the correct word
     */
    public Game(String correctWord) {
        this.correctWord = correctWord;
        this.lettersUsed = new ArrayList<>(26);
        this.guesses = new ArrayList<>();
    }

    /**
     * @return the number of guesses the user has left
     */
    public int getGuessesLeft() {
        return MAX_GUESSES - numGuesses;
    }

    /**
     * @param word_in The word submitted by the user
     * @return A single GuessResponse indicating the status of the submitted word
     */
    public GuessResponse guess(String word_in) {
        String word = word_in.toLowerCase();

        //If Guess is invalid
        if (!isValidGuess(word)) {
            return GuessResponse.invalid(numGuesses);
        }

        //If guess is an excluded word
        if (isExcludedWord(word)) {
            return GuessResponse.invalid(numGuesses);
        }

        //Guess is valid
        this.numGuesses++;
        ArrayList<LetterStatus> letterStatuses = new ArrayList<>();


        //Generate Letter Status for user feedback
        HashMap<Character, Integer> correctChars = new HashMap<>();
        HashMap<Character, Integer> usedChars = new HashMap<>();

        //Fill correctChars and fill letterStatuses
        for (int i = 0; i < correctWord.length(); i++){
            Character letter = correctWord.charAt(i);
            correctChars.put(letter, correctChars.getOrDefault(letter, 0)+1);
            letterStatuses.add(new LetterStatus(word.charAt(i), LetterStatus.Accuracy.WRONG));
        }

        //First Logic Loop - Fill Correct Letters
        for (int i = 0; i < correctWord.length(); i++) {
            char letter = word.charAt(i);
            lettersUsed.add(letter);

            if (letter == correctWord.charAt(i)) {
                usedChars.put(letter, usedChars.getOrDefault(letter, 0)+1);
                letterStatuses.set(i, new LetterStatus(letter, LetterStatus.Accuracy.CORRECT));
            }
        }

        //Second Logic Loop - Fill Wrong Letters
        for (int i = 0; i < correctWord.length(); i++) {
            char letter = word.charAt(i);

            //If letter is misplaced and check for amount of letters
            if (letter != correctWord.charAt(i)
                    && usedChars.getOrDefault(letter, 0) < correctChars.getOrDefault(letter, 0)) {

                usedChars.put(letter, usedChars.getOrDefault(letter, 0)+1);
                letterStatuses.set(i, new LetterStatus(letter, LetterStatus.Accuracy.MISPLACED));
            }
        }

        //If Guess is correct
        if (word.equals(correctWord)) {
            this.isComplete = true;
            this.isWon = true;

            guesses.add(new ValidGuess(word, letterStatuses));
            GuessResponse res = GuessResponse.correct(numGuesses, letterStatuses);
            guessResponses.add(res);
            return res;
        }

        //Last Guess
        if (numGuesses == MAX_GUESSES) {
            this.isComplete = true;

            guesses.add(new ValidGuess(word, letterStatuses));
            GuessResponse res = GuessResponse.lastIncorrect(numGuesses, letterStatuses);
            guessResponses.add(res);
            return res;
        }

        //Normal Guess
        guesses.add(new ValidGuess(word, letterStatuses));
        GuessResponse res = GuessResponse.validIncorrect(numGuesses, letterStatuses);
        guessResponses.add(res);
        return res;
    }

    public String randomHintWord() {
        String hintWord = this.dict.getRandomWord(word -> {
            for (ValidGuess guess : guesses) {
                if (!guess.fits(word)) return false;
            }

            return true;
        });

        if (hintWord == null) throw new IllegalStateException(
                "Could not find suitable hint word! (This should not be possible)"
        );

        return hintWord;
    }

    /**
     * @return the correct word
     */
    public String getCorrectWord() {
        return this.correctWord;
    }

    /**
     * @return the list of previous guesses
     */
    public List<ValidGuess> getGuesses() {
        return this.guesses;
    }

    /**
     * @return the list of previous guess responses
     */
    public List<GuessResponse> getGuessResponses() {
        return this.guessResponses;
    }

    /**
     * @return the user associated with the current game
     */
    public User getUser() {
        return user;
    }

    /**
     * @return true if the game is over, false otherwise
     */
    public boolean isComplete() {
        return isComplete;
    }

    /**
     * @return true if the game is won, false otherwise
     */
    public boolean isWon() {
        return isWon;
    }

    private boolean isValidGuess(String word) {
        for (ValidGuess guess : guesses) {
            if (guess.getWord().equals(word)) {
                return false;
            }
        }
        try {
            if (!dict.wordExists(word)) {
                return false;
            }
        } catch (IllegalArgumentException e) {
            return false;
        }

        return true;
    }

    /**
     * Check if the word is in the exclusion list
     * @param word the word to be checked
     * @return a boolean that is true if the word is in the exclusion list, false otherwise
     */
    private boolean isExcludedWord(String word) {
        return exclusionWords.contains(word);
    }

}
