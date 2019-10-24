const validUser = {
  id: "1",
  username: "Pete",
  password: "pass",
  info: {
    ok: true
  }
};

const roles = {
  "1": ["read", "edit"]
};

const verifyUser = (username, password, cb) => {
  if (username === validUser.username && password === validUser.password) {
    cb(undefined, validUser.info);
  } else cb("Invalid login");
};

const getRoles = (username, cb) => {
  if (username === validUser.username) {
    cb(undefined, roles[validUser.id]);
  } else cb("No roles");
};

const logAccess = (username, cb) => {
  if (username === validUser.username) {
    cb(undefined);
  } else {
    console.log(`${validUser.username} logged in!`);
    cb("WHat . heppa");
  }
};

export default {
  verifyUser,
  getRoles,
  logAccess
};
