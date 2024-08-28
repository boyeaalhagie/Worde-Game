import {Row} from "react-bootstrap";
import {FileInput} from "@blueprintjs/core";
import React, {FormEvent} from "react";
import axios from "axios";
import {ChangeListRequest} from "../request/ChangeListRequest";
import {parseUserJson, User} from "../request/User";
import {backendAddress} from "../util";

/**
 * The visual representation of the exclusion word input
 * @returns The visual representation of the exclusion word input
 */
export function getExclusionInterface() {
    return (
        <Row>
            <p>Input exclusion words</p>
            <FileInput
                disabled={false}
                text = {"Input Exclusion File"}
                onInputChange={addExclusionWords}
            />
        </Row>
    );
}

/**
 * Adds the exclusion words to the backend
 * @param file
 */
async function addExclusionWords(file: FormEvent<HTMLInputElement>) {
    if (file.currentTarget.files === null || file.currentTarget.files.length === 0) {
        console.log("No file inputted");
        return null;
    }
    console.log("File received!");

    let separateWords: string[] = [];

    let words = await file.currentTarget.files[0].text();

    if (words === undefined) {
        console.log("No words received");
        return null;
    }

    if (file.type === "text/plain") {
        separateWords = words.split(/\r?\n/);
    } else if(file.type === "text/csv"){
        separateWords = words.split(",");
    }

    console.log("Words received: ", separateWords, "Number of words: ", separateWords.length);

    let user: User
    let userRaw = localStorage.getItem("user");
    if (userRaw) {
        user = parseUserJson(userRaw);
    }else{
        return
    }

    await axios.post(backendAddress() + "addExclusionWords", new ChangeListRequest(user, separateWords))
}