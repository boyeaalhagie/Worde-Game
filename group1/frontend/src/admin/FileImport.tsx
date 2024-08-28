import React from "react";
import {Button, FileInput} from "@blueprintjs/core";
import {Row} from "react-bootstrap";
import {ChangeListRequest} from "../request/ChangeListRequest";
import {NamedUser, parseUserJson, User} from "../request/User";

/**
 * The props for the game input
 */
interface IFileImportProps {
    disabled:boolean;
    submitChangeList: (guess:ChangeListRequest) => void;
}

/**
 * The visual representation of the game input
 * @param props the props for the game input
 * @returns The visual representation of the file import
 */
export function FileImport(props: IFileImportProps): React.ReactElement {

    const boxText:string = "";
    const buttonText:string = "Confirm";

    let file:File | null = null;

    /**
     * Handles the vocab list swap
     */
    const handleButtonPress = async () => {
        if (file != null) {
            let words_raw: string;
            words_raw = await file.text();
            let words: string[];


            let user: User
            let userRaw = localStorage.getItem("user");
            if (userRaw) {
                user = parseUserJson(userRaw);
            }else{
                return
            }

            //TODO: Replace users with current user
            if (file.name.endsWith(".txt")) {
                words = words_raw.split(/\r?\n/);
                props.submitChangeList(new ChangeListRequest(user, words));
            } else if(file.name.endsWith(".csv")){
                words = words_raw.split(",");
                props.submitChangeList(new ChangeListRequest(user, words));
            }
        }
    }

    /**
     * Handles the file being inputted
     * @param event the event that triggered the file input
     */
    const handleFileChoose: React.FormEventHandler<HTMLInputElement>  = (event) => {
        let temp = event.currentTarget.files
        if (temp == null) {
            file = null;
        } else {
            file = temp.item(0);
        }
    }

    return (
        <div>
            <Row>
                <p>Change Vocab File</p>
                <FileInput
                    text={boxText}
                    disabled={props.disabled}
                    fill={false}
                    onInputChange = {(event: React.FormEvent<HTMLInputElement>) => handleFileChoose(event)}
                />
                <Button
                    text={buttonText}
                    minimal = {false}
                    onClick = {handleButtonPress}
                    disabled = {false}
                />
            </Row>
        </div>
        )
}
