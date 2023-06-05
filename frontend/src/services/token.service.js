import { Buffer } from "buffer";

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

    // updateLocalAccessToken(token) {
    //     let user = JSON.parse(localStorage.getItem("user"));
    //     user.token = token;
    //     window.localStorage.setItem("user", JSON.stringify(user));
    // }

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

}
const tokenService = new TokenService();

export default tokenService;