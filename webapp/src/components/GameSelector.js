import React, { Component } from 'react'
import classes from "../css/GameSelector.module.css"
export default class GameSelector extends Component {
    render() {
        return (
            <div className={classes.GameSelectorOuter}>
                <div className={classes.GameSelectorInner}>
                    <button className={`${classes.gameButton} ${classes.publicButton}`} onClick={() => this.props.startGame("public")}>Search For Game</button>
                    <p>Or</p>
                    <button className={`${classes.gameButton} ${classes.privateButton}`} onClick={() => this.props.startGame("private")}>Create Private Game</button>
                </div>
            </div>
        )
    }
}
