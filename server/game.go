package main

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type Player struct {
	conn        *websocket.Conn
	invite_link string
	word        string
	Game        *Game
	opponent    *Player
	io_chan     chan string
}

type Game struct {
	p1      *Player
	p2      *Player
	p1_word string
	p2_word string
}

func CreatePlayer(conn *websocket.Conn) *Player {
	io_chan := make(chan string, 1)
	return &Player{conn: conn, word: "", io_chan: io_chan, Game: nil}
}

func CreateGame(p1 *Player, p2 *Player) *Game {
	(*p1).opponent = p2
	(*p2).opponent = p1
	return &Game{p1: p1, p2: p2, p1_word: (*p1).word, p2_word: (*p2).word}
}

func (game *Game) StartGame() {
	fmt.Println("StartGame function called")
	go game.p1.readPlayerLoop(game.p2.io_chan, game.p1.io_chan)
	go game.p2.readPlayerLoop(game.p1.io_chan, game.p2.io_chan)
}

// start game
// send message to opponents channel
// read message from my channel

func (player *Player) readPlayerLoop(opponent_chan chan<- string, player_chan <-chan string) {
	(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte("START_GAME"))
	fmt.Println("Ready to read message")
	word, _ := readMSG((*player).conn)
	fmt.Println("Player word is: " + word)
	(*player).word = word
	opponent_chan <- word
	fmt.Println("Sent message to opponent channel")
	oppWord := <-player_chan
	fmt.Println("Received message from opponent channel")
	fmt.Println("oppWord word is: " + oppWord)
	(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte("WORD: "+word))
	fmt.Println("Entering readPlayer loop")
	for {
		// read a message
		msg, err := readMSG((*player).conn)
		if err != nil {
			(*player).opponent.conn.WriteMessage(websocket.TextMessage, []byte("ERR"))
			break;
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
