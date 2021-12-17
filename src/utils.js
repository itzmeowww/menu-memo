function randList(li) {
  return li[Math.round(Math.random() * li.length)];
}

function isInStr(msg, msgList) {
  let have = false;
  msgList.forEach((x) => {
    // console.log(msg.toLowerCase() + " " + x);
    if (msg.toLowerCase().includes(x)) {
      have = true;
    }
  });
  return have;
}

const findDateFromMenuName = (msg, db) => {
  let db = {
    "12/12/2021" : {
      
    }
  }
  db.entries()
};

module.exports = {
  randList,
  isInStr,
};
