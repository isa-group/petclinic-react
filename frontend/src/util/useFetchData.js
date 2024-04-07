import { useEffect, useState } from "react";
import { fetchWithPricingInterceptor } from "pricing4react";;

export default function useFetchData(url, jwt) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (url) {
            let ignore = false;
            fetchWithPricingInterceptor(url, {
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