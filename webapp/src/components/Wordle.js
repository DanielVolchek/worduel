import React from "react";
import GameBoard from "./GameBoard"
import BoardLetterClasses from "../css/BoardLetter.module.css"
class Wordle extends React.Component {
    constructor() {
        super()
        this.boardKey = 0
        this.state = {
            word: "WORLD",
            Board: this.initBoard(),
            targetRow: 0,
            targetCol: 0,
        }
        this.setTarget = this.setTarget.bind(this)
        this.listenKeyDown = this.listenKeyDown.bind(this)
    }
    componentDidMount() {
        if (!this.props.display)
        document.addEventListener("keydown", (event) => this.listenKeyDown(event))
    }
    setTarget = (el) => {
        console.log(el)
        if (el.props.row !== this.state.targetRow) {
            console.log("returning")
            console.log(el.row, this.state.targetRow)
            return
        }
        this.setState({
            ...this.state,
            targetRow: el.props.row,
            targetCol: el.props.col,
        })
    }
    listenKeyDown = (event) => {
        const isLetter = /[A-Za-z]/
        if (event.key === "Enter") {
            this.submitGuess()
        }
        if (!event.key.match(isLetter) || event.key.length > 1) {
            return
        }
        const newBoard = this.state.Board.map(el => {
            if (el.row === this.state.targetRow && el.col === this.state.targetCol) {
                return { ...el, letter: event.key.toUpperCase() }
            }
            return el
        })
        this.setState({
            ...this.state,
            Board: newBoard,
            targetCol: this.state.targetCol < 5 ? this.state.targetCol + 1 : this.state.targetCol
        })
    }
    submitGuess = () => {
        console.log("submitting guess")
        const boardCopy = this.state.Board
        const wordCopy = this.state.word
        console.log(boardCopy)
        for (let i = 0; i < 5; i++) {
            const letterIndex = this.state.targetRow * 5 + i
            console.log(`Word copy letter is ${wordCopy[i]} letter at boardindex is ${boardCopy[letterIndex].letter}`)
            if (wordCopy[i] === boardCopy[letterIndex].letter) {
                boardCopy[letterIndex] = {
                    ...boardCopy[letterIndex], letterstatus: BoardLetterClasses.right_place
                }
            }
            else if (wordCopy.includes(boardCopy[letterIndex].letter)) {
                boardCopy[letterIndex] = {
                    ...boardCopy[letterIndex], letterstatus: BoardLetterClasses.right_letter
                }
                //    todo
                // create new word
            }
            else {
                boardCopy[letterIndex] = {
                    ...boardCopy[letterIndex], letterstatus: BoardLetterClasses.wrong_letter
                }
            }
        }
        // todo
        // if target row is less than 6 (aka the game is not done)
        // increment by 1
        let targetRow = this.state.targetRow + 1
        // else call end game function
        this.setState({
            ...this.state,
            targetRow: targetRow,
            Board: boardCopy,
        })
        // todo submit function
        // checks word to see if any letter matches, 
        // if letter matches returns new letter of the right color
        // else returns wrong color
        // if guessed word is correct
        // call win function
        // otherwise move down one row unless row is at max
    }
    initBoard = () => {
        let row = -1
        let col = 0
        let list = []
        for (let i = 0; i < 30; i++) {
            this.boardKey++
            if (i % 5 === 0) {
                row++
                col = -1
            }
            col++
            list[i] = { key: this.boardKey, row: row, col: col, setTarget: this.setTarget, letter: "" }
        }
        return list
    }

    // initRows = () => {
    //     return (
    //         [
    //             [<BoardLetter key={this.Boardkey++} setTarget={this.setTarget} letter={"x"} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />,],
    //             [<BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />,],
    //             [<BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />,],
    //             [<BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />,],
    //             [<BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />,],
    //             [<BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />, <BoardLetter key={this.Boardkey++} setTarget={this.setTarget} />,],
    //         ]
    //     )
    // }
    render() {
        return (
            <div>
                {/* <div className={classes.GameBoard}>
                    {this.props.boardElements}
                </div> */}
                <GameBoard boardElements={this.state.Board} display={this.props.display}/>
            </div>
        )
    }
}

export default Wordle