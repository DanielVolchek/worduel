import React from "react";
import GameBoard from "./GameBoard"
import BoardLetterClasses from "../css/BoardLetter.module.css"
import validateFromDictAPI from "./ValidateWord";
class Wordle extends React.Component {
    constructor(props) {
        super(props)
        this.boardKey = 0
        this.state = {
            Board: this.initBoard(),
            targetRow: 0,
            targetCol: 0,
        }
        this.setTarget = this.setTarget.bind(this)
        this.listenKeyDown = this.listenKeyDown.bind(this)
    }
    componentDidMount() {
        if (this.props.player)
            document.addEventListener("keydown", (event) => this.listenKeyDown(event))
        else {
            console.log(this.props)
            this.props.ws.onmessage = (msg) => {
                this.receivedMessage(msg)
            }
        }
    }
    componentDidUpdate(prevprops) {
        // if (prevprops.word === "" && this.props.word !== ""){
        //     this.props.send("WORD: " + this.props.word)
        // }
        if (!prevprops.wsopen && this.props.wsopen) {
            if (this.props.inv_link !== "") {
                this.props.send("private")
                // this.props.send(this.props.word)
            } else if (this.props.player) {
                this.props.send("public")
                // this.props.send(this.props.word)
            }
        }
    }
    receivedMessage = (message) => {
        const msg = message.data
        console.log("received message: ")
        console.log(msg)
        const isLetter = /[A-Za-z]/
        if (msg === "Enter") {
            this.submitGuess()
            return
        }
        else if (msg.slice(0, 5) === "Word:") {
            this.props.update(msg.slice(5))
        }
        if (!msg.match(isLetter) || (msg !== "Backspace" && msg.length > 1)) {
            console.log("key error is " + msg)
            return
        }
        this.listenKeyDown({ key: msg })
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
        if (!event.key.match(isLetter) || (event.key !== "Backspace" && event.key.length > 1)) {
            console.log("key error is " + event.key)
            return
        }
        let newBoard;
        let newCol = this.state.targetCol;
        if (event.key === "Backspace") {
            console.log("Got backspace")
            newBoard = this.state.Board.map(el => {
                if (el.row === this.state.targetRow && el.col === this.state.targetCol) {
                    return { ...el, letter: "" }
                }
                return el
            })
            newCol = this.state.targetCol > 0 ? this.state.targetCol - 1 : this.state.targetCol
        }
        else {
            newBoard = this.state.Board.map(el => {
                if (el.row === this.state.targetRow && el.col === this.state.targetCol) {
                    return { ...el, letter: event.key.toUpperCase() }
                }
                return el
            })
            newCol = this.state.targetCol < 5 ? this.state.targetCol + 1 : this.state.targetCol
        }
        this.setState({
            ...this.state,
            Board: newBoard,
            targetCol: newCol
        })
        if (this.props.player){
            this.props.send(event.key)
        }
    }
    submitGuess = async () => {
        console.log("submitting guess")
        const boardCopy = this.state.Board
        const wordCopy = this.props.word 
        let fullWord = ""
        console.log(boardCopy)
        for (let i = 0; i < 5; i++) {
            const letterIndex = this.state.targetRow * 5 + i
            if (boardCopy[letterIndex].letter === "") {
                return
            }
            fullWord += boardCopy[letterIndex].letter
        }

        console.log(`validating word ${fullWord}`)
        const valid = await validateFromDictAPI(fullWord)
        if (valid.title) {
            console.log("word is not valid")
            return
        }
        for (let i = 0; i < 5; i++) {
            const letterIndex = this.state.targetRow * 5 + i
            // Right place
            if (wordCopy[i] === boardCopy[letterIndex].letter) {
                boardCopy[letterIndex] = {
                    ...boardCopy[letterIndex], letterstatus: BoardLetterClasses.right_place
                }
            }
            // Right letter
            else if (wordCopy.includes(boardCopy[letterIndex].letter)) {
                boardCopy[letterIndex] = {
                    ...boardCopy[letterIndex], letterstatus: BoardLetterClasses.right_letter
                }
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
        if (this.props.player){
            this.props.send("Enter")
        }
        this.setState({
            ...this.state,
            targetRow: targetRow,
            targetCol: 0,
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
    render() {
        return (
            <div>
                <GameBoard boardElements={this.state.Board} player={this.props.player} />
            </div>
        )
    }
}

export default Wordle