package main

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type Player struct {
	conn         *websocket.Conn
	invite_link  string
	word         string
	Game         *Game
	opponent     *Player
	opponent_in  <-chan string
	opponent_out chan<- string
}

type Game struct {
	p1      *Player
	p2      *Player
	p1_word string
	p2_word string
}

func CreatePlayer(conn *websocket.Conn) *Player {
	opponent_in := make(chan string)
	opponent_out := make(chan string)
	return &Player{conn: conn, word: "", opponent_in: opponent_in, opponent_out: opponent_out, Game: nil}
}

func CreateGame(p1 *Player, p2 *Player) *Game {
	(*p1).opponent = p2
	(*p2).opponent = p1
	return &Game{p1: p1, p2: p2, p1_word: (*p1).word, p2_word: (*p2).word}
}

func (game *Game) StartGame() {
	fmt.Println("starting new game")
	go game.p1.readPlayerLoop(game.p1.opponent_in, game.p1.opponent_out)
	go game.p2.readPlayerLoop(game.p1.opponent_in, game.p1.opponent_out)
}

func (player *Player) readPlayerLoop(opponent_in <-chan string, opponent_out chan<- string) {
	(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte("START_GAME"))
	word, _ := readMSG((*player).conn)
	(*player).word = word
	opponent_out <- word
	<-opponent_in
	(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte("WORD: "+word))
	fmt.Println("Starting new game")
	for {
		// read a message
		msg, err := readMSG((*player).conn)
		if err != nil {
			(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte("ERR"))
		}
		// write to other player
		(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte(msg))
	}
}

func (player *Player) addPlayerToQueue() {
	for i, p := range PlayerQueue {
		if (*p).invite_link == "" {
			game := CreateGame(player, p)
			Games = append(Games, game)
			game.StartGame()
			PlayerQueue = append(PlayerQueue[:i], PlayerQueue[i+1:]...)
			return
		}
	}
	PlayerQueue = append(PlayerQueue, player)
}

func (player *Player) evaluateInviteLink(invite_link string) {
	for _, p := range Players {
		if (*p).invite_link == invite_link {
			game := CreateGame(player, p)
			Games = append(Games, game)
			game.StartGame()
			return
		}
	}
	(*player).invite_link = invite_link
}
