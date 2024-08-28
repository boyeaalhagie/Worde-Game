import {FormEvent} from "react";
import axios from "axios";
import {backendAddress} from "../util";

let textDocument: HTMLAnchorElement = document.createElement("a");
export class FileTesting {
    /**
     * Sends a test file to the backend to be tested
     * @param file the file to send
     * @returns the file to download
     */
    public static async sendFromFile(file: FormEvent<HTMLInputElement>) : Promise<HTMLAnchorElement | null> {
        if (file.currentTarget.files === null || file.currentTarget.files.length === 0) {
            console.log("No file inputted");
            return null;
        }
        console.log("File received!");

        let separateWords: string[] = [];

        let words= await file.currentTarget.files[0].text();

        if (words !== undefined) {
            separateWords = words.split(/\r?\n/);
        }

        console.log("Words received: ", separateWords, "Number of words: ", separateWords.length);

        await axios.post(backendAddress() + "runTestGames", separateWords).then((res) => {
            console.log("Response: ", res.data);
            textDocument.href = URL.createObjectURL(new Blob(res.data.split(/\r?\n/), {type: "text/plain"}));
        });


        textDocument.download = "testResults.txt";
        return textDocument;
    }

    /**
     * Downloads the file generated from running a test by file
     */
    public static downloadFile() {
        if (textDocument.href !== null) {
            textDocument.click();
            window.URL.revokeObjectURL(textDocument.href);
            return;
        }

    }

}