const MIN_LENGTH_OF_USERNAME = 3;
const MAX_LENGTH_OF_USERNAME = 20;
const FORBIDDEN_USERNAMES = ["server"];

const USERNAME_IS_TAKEN = "Username is taken";
const USERNAME_CANT_BE_SERVER = `Username can't be any of the following: ${FORBIDDEN_USERNAMES}`;
const USERNAME_IS_TOO_SHORT = `Username can't be shorter than ${MIN_LENGTH_OF_USERNAME} letters long`;
const USERNAME_IS_TOO_LONG = `Username can't be longer than ${FORBIDDEN_USERNAMES} letters long`;

function User() {
  this.Username = "";
}

validateUser = (username, users) => {
  var lowerUsername = username.toLowerCase();
  if (users[lowerUsername] !== undefined) return USERNAME_IS_TAKEN;
  else if (FORBIDDEN_USERNAMES.includes(username.toLowerCase()))
    return USERNAME_CANT_BE_SERVER;
  else if (MIN_LENGTH_OF_USERNAME > username.length)
    return USERNAME_IS_TOO_SHORT;
  else if (username.length > MAX_LENGTH_OF_USERNAME)
    return USERNAME_IS_TOO_LONG;
  return null;
};

getNextNextUser = (room) => {
  let nextUserIndex = getNextUserIndex(room.whosUserTurn, room.length);
  let nextNextUserIndex = getNextUserIndex(nextUserIndex, room.length);
  const nextNextPlayer = getUserByIndex(room.Users, nextNextUserIndex);
  return nextNextPlayer;
};

getNextUser = (room) => {
  let nextUserIndex = getNextUserIndex(room.whosUserTurn, room.length);
  const nextPlayer = getUserByIndex(room.Users, nextUserIndex);
  return nextPlayer;
};

getNextUserIndex = (currentUserIndex, numberOfUsersInRoom) => {
  return isLastUser(currentUserIndex, numberOfUsersInRoom)
    ? 0
    : currentUserIndex + 1;
};

isLastUser = (userIndex, numberOfUsersInRoom) => {
  return userIndex === numberOfUsersInRoom - 1;
};

getUserByIndex = (Users, userIndex) => {
  const nextUser = Users[userIndex];
  return nextUser;
};

createUser = (username) => {
  let newUser = new User();
  newUser.Username = username;
  return newUser;
};

module.exports = {
  getNextNextUser,
  getNextUser,
  getNextUserIndex,
  getUserByIndex,
  createUser,
  validateUser,
};
