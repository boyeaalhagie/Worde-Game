import React from 'react';
import "../styles/Spinner.css"
import {checkBackendConnection} from "../util";
import {Spinner} from "@blueprintjs/core";

let load = async () => {
    let conn = await checkBackendConnection()
    return conn ? "remote": "local"
};

export enum LoadStatus {
    Pending,
    Done
}

const loading = wrapPromise(load());

function wrapPromise<T>(promise: Promise<T>) {
    let status = LoadStatus.Pending;
    let response: T;

    const suspender = promise.then(
        res => {
            status = LoadStatus.Done;
            response = res;
        },
    );

    const read = () => {
        if (status === LoadStatus.Pending) {
            throw suspender;
        } else {
            return response;
        }
    };

    return { read };
}

export const DataFetching = () => {
    const wah = loading.read();

    return <p hidden>{wah}</p>;
}

export const LoadingPage = () => {
    return (
        <div className="spinner-container">
            <Spinner className={"loadSpinner"} size={100}/>
        </div>
    );
}