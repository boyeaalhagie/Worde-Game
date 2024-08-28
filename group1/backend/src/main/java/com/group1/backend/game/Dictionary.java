package com.group1.backend.game;

import jakarta.annotation.Nullable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.function.Predicate;
import java.util.stream.Collectors;


/**
 * file: 	Dictionary.java
 * @author 	barganzj
 * updated: 2/14/2024
 * brief: 	Dictionary with methods to help manage words
 */
public class Dictionary {

	private HashSet<String> vocab;
	private int wordLength;

	private List<String> exclusionWords;


	/**
	 * Pass in a list of words to use in the dictionary that supports different sized words
	 * @param words Words to add
	 * @param newWordLength Length of words added
	 */
	public void changeVocab(List<String> words, int newWordLength){
		vocab = words.stream().map(String::toLowerCase).collect(Collectors.toCollection(HashSet::new));
		wordLength = newWordLength;
	}

	/**
	 * Pass in a list of words to use in the dictionary
	 * @param words Words to add
	 */
	public void changeVocab(List<String> words){
		changeVocab(words, words.get(0).length());
	}

	/**
	 * Pass in a path to file of list of words to use in the dictionary
	 * @param path Path of dictionary words to import
	 * @return true if success, false if error
	 */
	public boolean importVocab(String path){
		List<String> lines;
		try{
			lines = Files.readAllLines(Path.of(path));
		} catch(IOException e) {
			System.out.println("Failed to import dictionary! " + e);
			return false;
		}

		changeVocab(lines, lines.get(0).length());

		return true;
	}

	/**
	 * Return a random word from the Hashset
	 * @return Selected word
	 */
	public String getRandomWord(){
		//Confirm there are words, throw exception if none
		if(vocab == null){
			throw new IllegalStateException("Dictionary does not have a word set!");
		}

		ArrayList<String> wordList = new ArrayList<>(vocab);
		int randIndex = (int)(Math.random()*wordList.size());
		System.out.println(wordList.get(randIndex));
		return wordList.get(randIndex);
	}

	public @Nullable String getRandomWord(Predicate<String> filter) {
		if (vocab == null){
			throw new IllegalStateException("Dictionary does not have a word set!");
		}

		ArrayList<String> wordList = new ArrayList<>(vocab);
		ThreadLocalRandom rand = ThreadLocalRandom.current();

		while (!wordList.isEmpty()) {
			int randIndex = rand.nextInt(wordList.size());
			String word = wordList.remove(randIndex);
			if (filter.test(word)) {
				return word;
			}
		}

		return null;
	}

	/**
	 * Method to check if a word is in the dictionary
	 * @param word Word to check if exists
	 */
	public boolean wordExists(String word){
		if(word.length() != wordLength){
			throw new IllegalArgumentException(
					"Word is invalid length for current word size");
		}
		if (exclusionWords != null && exclusionWords.contains(word.toLowerCase())) {
			return false;
		}
		return vocab.contains(word.toLowerCase());
	}

	/**
	 * Add words to the exclusion list
	 * @param words a String array of words to be added to the exclusion list
	 */
	public void addExclusionWords(List<String> words) {
		exclusionWords = words;
	}


	/**
	 * Get the length of the words in the dictionary
	 * @return Length of words in current dictionary
	 */
	public int getWordLength(){
		return wordLength;
	}

}