import IndexPage from "./IndexPage";
import WelcomePage from "./WelcomePage";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

export default function HomePage() {
    let {user} = useContext(AuthContext);
    if(user) {
        return <IndexPage/>
    } else {
        return <WelcomePage />
    }
}