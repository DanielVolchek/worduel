package main

import (
	"fmt"
)

const (
	MSG_LEN   = 20
	HTTP_PORT = "8080"
)

var PlayerQueue []*Player
var Players []*Player
var Games []*Game

func main() {
	Players = make([]*Player, 0)
	PlayerQueue = make([]*Player, 0)
	Games = make([]*Game, 0)
	fmt.Println("Setting up HTTP routes")
	setupHTTPRoutes()
}

/*

Setup WS route
Open connection
Put client in connection queue
If queue has more than one person attempt to connect
If connection fails move on to next connection attempt
If all connection attempts fail drop client

If connection attempt succeeds,
Wait for words from both clients
Then wait for each letters
*/
