import { Buffer } from "buffer";
import { fetchWithPricingInterceptor } from "pricing4react";

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

class TokenService {
    getLocalRefreshToken() {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.refreshToken;
    }

    // getLocalAccessToken() {
    //     const user = JSON.parse(localStorage.getItem("user"));
    //     return user?.token;
    // }

    getLocalAccessToken() {
        const jwt = JSON.parse(localStorage.getItem("jwt"));
        return jwt ? jwt : null;
    }

    getFeaturesFromToken() {
        const jwt = JSON.parse(localStorage.getItem("jwt"));

        if (jwt) {

            let jwtBody = parseJwt(jwt);

            return jwtBody.features;
        }

        return null;
    }

    updateLocalAccessToken(token) {
        window.localStorage.setItem("jwt", JSON.stringify(token));
    }

    getUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    setUser(user) {
        window.localStorage.setItem("user", JSON.stringify(user));
    }

    removeUser() {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("jwt");
    }

    updateJWTToken() {

        return new Promise((resolve, reject) => {
            fetchWithPricingInterceptor("/api/v1/auth/refreshToken", {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${this.getLocalAccessToken()}`,
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => response.json())
            .then((data) => {
                this.updateLocalAccessToken(data.newToken);
                resolve();
            }).catch((error) => {reject(error)});
        });
    }

}
const tokenService = new TokenService();

export default tokenService;