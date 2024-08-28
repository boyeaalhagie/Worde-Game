import {Button, Row} from "react-bootstrap";
import {FileInput} from "@blueprintjs/core";
import {FileTesting} from "./FileTesting";
import React from "react";
import {parseUserJson, User} from "../request/User";

/**
 * The visual representation of the test file input
 */
export function getTestInterface() {
    //TODO: Replace the if(true) with the actual condition to check if the user is a tester
    let user: User
    let userRaw = localStorage.getItem("user");
    if (userRaw) {
        user = parseUserJson(userRaw);
    }else{
        return
    }

    if (userRaw && user.getPrivileges()>0) {
        return (
            <Row>
                <p>Test file input</p>
                <FileInput
                    disabled={false}
                    text = {"Input Test File"}
                    onInputChange={FileTesting.sendFromFile}
                />
                <p>    </p>
                <Button className="fileButton" onClick={() => {FileTesting.downloadFile();}}>
                    <span>Download Output File</span>
                </Button>
            </Row>
        );
    }
    return(<></>);
}