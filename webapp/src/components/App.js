import React from "react";
import Wordle from "./Wordle"
import classes from "../css/app.module.css"
class App extends React.Component {
    render() {
        return (
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <Wordle />
                <Wordle display={true}/>
            </div>
        )
    }
}
export default App