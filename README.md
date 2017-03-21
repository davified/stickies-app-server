# Stickies server

The web-sockets server for Stickies - a real-time application for posting and sharing stickies

### Getting started
1) `git clone https://github.com/davified/stickies-app-server`
2) `npm install`
3) `npm start` or `nodemon server.js` (you may need to install nodemon by running `npm install -g nodemon`)

### Socket events
The sockets server accepts the following socket events:

|Events| Remarks | Callback functions |
|---|---|---|
|`connection`| This event is fired when the client requests for '/' | `socket.emit('connectionSuccess')` and sends back a payload which contains a message with a count of number of websocket connections to the server
|`createRoom`|This is for creating unique rooms| The server creates a room with the roomName supplied by the client, connects the client automatically to the room and emits a `connectToRoom` event to the client. (If the room name already exists, the user will be directed to the existing room)|
|`sendMessage`| When the client clicks on some kind of 'post message' button| The server broadcasts the message to all sockets within the same room by emitting a `broadcastMessageToRoom` event |
|`joinRoom`| When the client provides the name of the room that he/she wants to join| The server adds the user to the room and emits a `loadMessageHistory` event with a payload of an array of messages relevant to the room|

See `public/javascript/socket-client.js` for example client-side code
