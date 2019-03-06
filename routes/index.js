const express = require('express');
const router = express.Router();
const fs = require('fs');

let users = [];
let userID = 1;

function findUser(id) {
  let rtn = false;
  for(let i in users) {
    if(users[i].id == id) {
      rtn = users[i];
      rtn.index = i;
      break;
    }
  }
  return rtn;
}

function writeUsers() {
  fs.writeFileSync('./users.json', JSON.stringify(users));
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/addUser', (req, res, next) => {
  users.push({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    id: userID
  });
  userID++;
  writeUsers();
  res.redirect('/');
});

router.get('/listUsers', (req, res, next) => {
  res.render('getUsers', { users: users });
});

router.get(/deleteUser/, (req, res, next) => {
  let id = req.url.slice(11);
  if(id.slice(-1) == '?') {
    id = id.slice(0,-1);
  }
  let rtn = findUser(id);
  if(rtn) {
    users.splice(rtn.index, 1);
    res.redirect('/listUsers');
  } else {
    res.send('ERROR: User Does Not Exist');
  }
});

router.get(/editUser/, (req, res, next) => {
  let id = req.url.slice(9);
  if(id.slice(-1) == '?') {
    id = id.slice(0,-1);
  }
  let rtn = findUser(id);
  if(rtn) {
    res.render('editUsers', {user: rtn});
  } else {
    res.send('ERROR: User Does Not Exist');
  }
  res.end();
});

router.post(/updateUser/, (req, res, next) => {
  let id = req.url.slice(11);
  if(id.slice(-1) == '?') {
    id = id.slice(0,-1);
  }
  let rtn = findUser(id);
  if(rtn) {
    users[rtn.index].name = req.body.name;
    users[rtn.index].email = req.body.email;
    users[rtn.index].age = req.body.age;
    writeUsers();
    res.redirect('/listUsers')
  } else {
    res.send('ERROR: User Does Not Exist');
  }
  res.end();
});


module.exports = router;
