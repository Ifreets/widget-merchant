/**
 * lib để request api
 */

import type { Method } from "@/service/helper/request";

interface InputRequest {
    uri: string;
    method: Method;
    body?: any;
    json?: boolean;
    headers?: any;
}

export const request = async ({
    uri,
    method,
    json,
    body = {},
    headers = {},
}: InputRequest) => {
    if (json) {
        body = JSON.stringify(body);
        headers = {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            ...headers,
        };
    }

    if (method === "GET") body = undefined;
    try {
        let r = await fetch(uri, { method, headers, body });
        if (json) r = await r.json();
        return r;
    } catch (e) {
        return e;
    }
};
