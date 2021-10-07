const {
  getNextNextUser,
  getNextUser,
  getNextUserIndex,
  createUser,
  validateUser,
} = require("./users");
const { sleep, setToLowerCase } = require("./helping-functions");
const { isRoomNameValid, isUserInRoom } = require("./room");

var express = require("express"),
  app = express(),
  http = require("http").Server(app),
  io = require("socket.io")(http, {
    cors: { origin: "*" },
  });

const PORT = 8080;
http.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

// Room Class
function Room() {
  this.Users = {};
  this.Host = null;
  this.Name = "";
  this.length = 0;
  this.whosUserTurn = 0;

  this.addUser = function (user) {
    user !== undefined
      ? (this.Users[this.length] = user)
      : console.log("ERROR: add user");
  };
  this.addHost = function (host) {
    host !== undefined ? (this.Host = host) : console.log("ERROR: set host");
  };
  this.setName = function (name) {
    name !== undefined ? (this.Name = name) : console.log("ERROR: set name");
  };
}

users = {};
rooms = {};

io.on("connection", function (socket) {
  //console.log(socket);
  console.log("Added a new user connection.");

  socket.on("add-user", function (username, fn) {
    //Check if username is avaliable.
    let errorMessage = validateUser(username, users);

    if (errorMessage !== null) {
      fn(false, errorMessage);
      return;
    }

    console.log(`Added user: ${username}`);
    socket.Username = username;

    let newUser = createUser(username);

    //Store user object in global user roster.
    users[username.toLowerCase()] = newUser;
    fn(true, ""); // Callback, user name was valid
  });

  // Returns the list of rooms to all
  // component that have .on('rooms')
  socket.on("room-list", function () {
    socket.emit("rooms", rooms);
  });

  socket.on("add-room", function (roomObj, fn) {
    const { Name } = roomObj;

    const errorMessage = isRoomNameValid(Name, rooms);
    if (errorMessage !== null) {
      fn(false, errorMessage);
      return;
    }

    var newRoom = new Room();
    newRoom.Name = Name;

    let host = createUser(socket.Username);

    newRoom.addHost(host);

    rooms[setToLowerCase(Name)] = newRoom;
    fn(true, "");

    io.sockets.emit("rooms", rooms);
    socket.emit("room-created", newRoom.Name, rooms);
  });

  socket.on("join-room", function (roomObj, fn) {
    var room = roomObj.room;
    var lowerRoom = room.toLowerCase();
    console.log(
      `${socket.Username} is trying to join the room: ${room} (${lowerRoom})`
    );
    if (rooms[lowerRoom] === undefined) {
      fn(false, `${room} room does not exists`);
    } else if (rooms[lowerRoom].Users[socket.Username] !== undefined) {
      fn(false, `${socket.Username} is already in ${room}`);
    } else {
      console.log(`Joined Room: ${socket.Username} joined ${room}.`);
      //We need to let the server know beforehand so that he starts to prepare the client template.
      fn(true, "");
      //Add user to room.

      let newUser = createUser(socket.Username);

      rooms[lowerRoom].addUser(newUser);
      rooms[lowerRoom].length++;

      socket.Room = lowerRoom;
      //Send the room information to the client.
      io.sockets.emit("update-users", rooms[lowerRoom]);
    }
  });

  socket.on("leave-room", function (roomObj, fn) {
    var room = roomObj.room;
    var lowerRoom = room.toLowerCase();
    console.log(
      `${socket.Username} is trying to leave the room: ${room} (${lowerRoom})`
    );
    if (rooms[lowerRoom] === undefined) {
      fn(false, `${room} room does not exists`);
    } else if (isUserInRoom(socket.Username, rooms[lowerRoom]) == false) {
      fn(false, `${socket.Username} is not in ${room}`);
    } else {
      console.log(`Left Room: ${socket.Username} joined ${room}.`);
      //We need to let the server know beforehand so that he starts to prepare the client template.
      fn(true, "");
      //Add user to room.
      delete rooms[lowerRoom].Users[socket.Username.toLowerCase()];
      rooms[lowerRoom].length--;

      socket.Room = undefined;
      //Send the room information to the client.
      io.sockets.emit("update-users", rooms[lowerRoom]);

      if (
        rooms[lowerRoom].Host.Username.toLowerCase() ===
        socket.Username.toLowerCase()
      ) {
        console.log(
          `Host: ${socket.Username.toLowerCase()} left room: ${lowerRoom}`
        );
        const userKeys = Object.keys(rooms[lowerRoom].Users);
        userKeys.map((userKey) => {
          const currentUser = rooms[lowerRoom].Users[userKey];
          const currentUsername = currentUser.Username;
          io.sockets.emit(
            "host-left-room",
            rooms[lowerRoom].Name,
            currentUsername
          );
        });
        delete rooms[lowerRoom];
        io.sockets.emit("rooms", rooms);
      }
    }
  });

  socket.on("start-game", async function (roomObj, fn) {
    var room = roomObj.room;
    console.log(`${socket.Username} is trying to start game in room ${room}`);
    if (rooms[setToLowerCase(room)] === undefined) {
      fn(false, `${room} room does not exists`);
      console.log(`Room: ${room} was not found`);
    } else {
      console.log(`${socket.Username} has started a game in room ${room}`);
      fn(true, "");
      // TODO: emit some message to all other users that the game has begun
      io.sockets.emit("started-game", setToLowerCase(room));

      const serverRoom = rooms[setToLowerCase(room)];

      const nextNextUser = getNextNextUser(serverRoom);

      console.log({ host: serverRoom.Host, nextNextUser });
      await sleep(1000);

      io.sockets.emit("my-turn", serverRoom, serverRoom.Host);
      io.sockets.emit("i-am-next", serverRoom, nextNextUser);

      rooms[setToLowerCase(room)].whosUserTurn = getNextUserIndex(
        serverRoom.whosUserTurn,
        serverRoom.length
      );
    }
  });

  socket.on("end-turn", function (roomObj, fn) {
    var roomName = roomObj.room;
    var roomNameSetToLower = setToLowerCase(roomName);
    console.log(
      `${socket.Username} is ending his/her turn in room: ${roomName}`
    );
    if (rooms[roomNameSetToLower] === undefined) {
      fn(false, `${roomName} room does not exists`);
    } else {
      const room = rooms[roomNameSetToLower];

      const nextUser = getNextUser(room);
      const nextNextUser = getNextNextUser(room);

      console.log({ nextUser, nextNextUser });

      io.sockets.emit("my-turn", room, nextUser);
      io.sockets.emit("i-am-next", room, nextNextUser);

      rooms[roomNameSetToLower].whosUserTurn = getNextUserIndex(
        room.whosUserTurn,
        room.length
      );
      fn(true, "");
    }
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", function () {
    if (socket.Username) {
      console.log(`Disconnected: ${socket.Username}`);
      // TODO: Delete user from all rooms he is in
      socket.emit("leave-room", { room: socket.Room }, (success, errorM) => {
        return;
      });
      delete users[socket.Username.toLowerCase()];
    }
  });
});
