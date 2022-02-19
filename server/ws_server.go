package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  MSG_LEN,
	WriteBufferSize: MSG_LEN,
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {
	fmt.Println("hit ws endpoint")
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
	}

	log.Println("Client succesfully connected...")
	processWSConn(ws)

}

func setupHTTPRoutes() {
	log.Println("Setting up routes")
	http.HandleFunc("/", wsEndpoint)
	log.Println("Listening on port: " + HTTP_PORT)
	log.Fatal(http.ListenAndServe(":"+HTTP_PORT, nil))
}

func readMSG(ws_conn *websocket.Conn) (message string, err error) {
	_, msg_buf, err := ws_conn.ReadMessage()
	if err != nil {
		return "", err
	}
	message = getMessageFromBuff(msg_buf)
	fmt.Println(message)
	return message, nil
}

func getMessageFromBuff(msg_buf []byte) (val string) {
	for _, letters := range msg_buf {
		if letters == 0 {
			return
		}
		val += string(letters)
	}
	return
}

func processWSConn(ws_conn *websocket.Conn) error {
	gameType, err := readMSG(ws_conn)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	if gameType == "public" {
		new_player := CreatePlayer(ws_conn)
		new_player.addPlayerToQueue()
		// Add player to queue
	} else if gameType == "private" {
		invite_link, err := readMSG(ws_conn)
		if err != nil {
			fmt.Println(err.Error())
			return err
		}
		new_player := CreatePlayer(ws_conn)
		Players = append(Players, new_player)
		new_player.evaluateInviteLink(invite_link)
	}
	return nil
}
