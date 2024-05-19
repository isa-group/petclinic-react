import "../../static/css/home/homeLogged.css";
import { useState, useEffect } from "react";

export default function HomeLogged(){
    
    const [username, setUsername] = useState("");

    useEffect(() => {
        setUsername(JSON.parse(localStorage.getItem("user"))["username"]);
    })
    
    return(
        <div class="home-logged-page">
            <h1>Welcome to petclinic {username}!</h1>
        </div>
    );
}