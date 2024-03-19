import { useEffect, useState } from "react";
import { fetchWithInterceptor } from "../services/api";

export default function useFetchData(url, jwt) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (url) {
            let ignore = false;
            fetchWithInterceptor(url, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                },
            })
                .then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        setData(json);
                    }
                }).catch((message) => alert(message));
            return () => {
                ignore = true;
            };
        }
    }, [url, jwt]);
    return data;
}