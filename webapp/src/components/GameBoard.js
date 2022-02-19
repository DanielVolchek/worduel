import React from "react";
import classes from "../css/GameBoard.module.css"
import BoardLetter from "./BoardLetter";
class GameBoard extends React.Component {
    render() {
        let boardLetters = this.props.boardElements.map(bEl => (
            <BoardLetter
                key={bEl.key} row={bEl.row} col={bEl.col}
                setTarget={bEl.setTarget} letter={bEl.letter}
                letterstatus={bEl.letterstatus ?? classes.default}
            />
        ))
        return (
            <div>
                <h2>{this.props.display ?  "Their" : "Your"} board</h2>
                <div className = { classes.GameBoard } >
                    { boardLetters }
                </div>
            </div>
        )
    }
}

export default GameBoard