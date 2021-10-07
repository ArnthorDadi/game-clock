const MIN_LENGHT_OF_ROOM_NAME = 3;
const MAX_LENGHT_OF_ROOM_NAME = 20;

const MIN_LENGHT_OF_ROOM_NAME_ERROR_MESSAGE = `Room name must be at least ${MIN_LENGHT_OF_ROOM_NAME} letters`;
const MAX_LENGHT_OF_ROOM_NAME_ERROR_MESSAGE = `Room name must be shorter than ${MAX_LENGHT_OF_ROOM_NAME} letters`;
const ROOM_NAME_TAKEN_ERROR_MESSAGE = `Room name is taken by another room`;

const { getUserByIndex } = require("../users");

isRoomNameValid = (name, rooms) => {
  if (name.length < MIN_LENGHT_OF_ROOM_NAME)
    return MIN_LENGHT_OF_ROOM_NAME_ERROR_MESSAGE;
  else if (MAX_LENGHT_OF_ROOM_NAME < name.length)
    return MAX_LENGHT_OF_ROOM_NAME_ERROR_MESSAGE;
  else if (rooms[name.toLowerCase()] !== undefined)
    return ROOM_NAME_TAKEN_ERROR_MESSAGE;
  return null;
};

isUserInRoom = (username, room) => {
  const userKeys = Object.keys(room.Users);
  const doesRoomContainUser = userKeys.some((userIndex) => {
    const user = getUserByIndex(room.Users, userIndex);
    return user.Username.toLowerCase() === username.toLowerCase();
  });
  return doesRoomContainUser;
};

module.exports = {
  isRoomNameValid,
  isUserInRoom,
};
