import React from "react";
import Wordle from "./Wordle"
import classes from "../css/app.module.css"
class App extends React.Component {
    render() {
        return (
            <div className={classes.App}>
                <Wordle />
                <Wordle display={true}/>
            </div>
        )
    }
}
export default App