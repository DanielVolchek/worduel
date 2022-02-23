import React, { Component } from 'react'
import Wordle from "./Wordle";
import validateFromDictAPI from './ValidateWord';
import classes from "../css/app.module.css"
export default class Game extends Component {
    constructor(props) {
        super(props)
        this.ws = null
        this.initWSConn()
        this.getInitialWord()
        this.state = {
            word: "",
            oppWord: "",
            wsopen: false,
            gameStarted: false
            // playerBoard, opponentBoard,
        }
        this.sendWSMessage = this.sendWSMessage.bind(this)
        this.updateOpponentWord = this.updateOpponentWord.bind(this)
    }
    initWSConn = () => {
        if (this.ws) {
            return
        }
        this.ws = new WebSocket("ws://localhost:8080")
        this.ws.onopen = () => {
            console.log("websocket connection initialized")
            this.setState({
                ...this.state,
                wsopen: true
            })
        }
        this.ws.onerror = (error) => {
            console.log("websocket connection failed")
            console.log("Error: " + error)
        }
        this.ws.onmessage = (msg) =>{
            if (msg.data === "START_GAME"){
                this.setState({
                    ...this.state,
                    // TODO
                    // Probably need to modify go to send this after receiving 
                    gameStarted: true
                })
            }
        }
    }
    sendWSMessage = (msg) => {
        console.log("Sending: " + msg)
        this.ws.send(msg)
    }
    getInitialWord = async () => {
        const word = prompt()
        console.log(word)
        const valid = await validateFromDictAPI(word)
        if (valid.title) {
            this.getInitialWord()
            return
        }
        else {
            this.setState({
                ...this.state,
                word: word.toUpperCase()
            })
            this.ws.send("WORD: " + word.toUpperCase())
        }
    }
    updateOpponentWord = (word) => {
        this.setState({
            ...this.state,
            oppWord: word,
        })
    }
    render() {
        return (
            <div className={classes.Game}>
                <Wordle
                    player={true}
                    ws={this.ws}
                    word={this.state.word}
                    inv_link={this.props.inv_link}
                    send={this.sendWSMessage}
                    wsopen={this.state.wsopen}
                />

                <Wordle
                    player={false}
                    ws={this.ws}
                    word={this.state.word}
                    inv_link={this.props.inv_link}
                    send={this.sendWSMessage}
                    wsopen={this.state.wsopen}
                    update={this.updateOpponentWord}
                />
            </div>
        )
    }
}
