function randList(li) {
  return li[Math.round(Math.random() * li.length)];
}

module.exports = {
  randList,
};
