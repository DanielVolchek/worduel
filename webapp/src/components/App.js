import React from "react";
import Game from "./Game";
import Wordle from "./Wordle"
import classes from "../css/app.module.css";
import GameSelector from "./GameSelector";
import InfoModal from "./InfoModal";
class App extends React.Component {
    constructor() {
        super()
        this.state = {
            gameRunning: false,
            gameType: "",
            inv_link: ""
        }
    }
    render() {
        return (
            <div className={classes.App} >
                <h1>WORDUEL</h1>
                {!this.state.gameRunning ? <GameSelector startGame={this.startGame} /> : null}
                {this.state.gameRunning ?
                    <Game gameType={this.state.gameType} inv_link={this.state.inv_link} /> : null
                }
            </div>

            // <div className={classes.App}>
            //     <Wordle />
            //     <Wordle display={true}/>
            // </div>
        )
    }

    startGame = (type) => {
        let inv_link = "" 
        if (type === "private") {
            // todo
            // either generate random invite link and display it or query server to check no one has the same invite link   
            inv_link = prompt("Enter invite link")
        }
        this.setState({
            ...this.state,
            gameRunning: true,
            gameType: type,
            inv_link: inv_link
        })
    }
}
export default App