import axios from "axios";

const REMOTE_URL = "http://135.148.121.116:8080/";
const LOCAL_URL = "http://localhost:8080/";

let backend: string | undefined;

export async function checkBackendConnection(): Promise<ConnectionType> {
    let res = await axios
        .get(LOCAL_URL + "ping")
        .catch((err) => {
            return {
                data: undefined
            }
        }
    );

    let isLocal = res.data == "pong";
    backend = isLocal ? LOCAL_URL : REMOTE_URL;
    return isLocal ? ConnectionType.Local : ConnectionType.Remote;
}

export function backendAddress() {
    return backend;
}

export enum ConnectionType {
    Local,
    Remote
}