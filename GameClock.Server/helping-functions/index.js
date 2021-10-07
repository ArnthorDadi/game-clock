function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const setToLowerCase = (theString = "") => {
  return theString.toLowerCase();
};

module.exports = {
  sleep,
  setToLowerCase,
};
