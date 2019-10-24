import dataBase from "./api";

const verifyUser_1 = function(username, password, callback) {
  dataBase.verifyUser(username, password, (error, userInfo) => {
    if (error) {
      callback(error);
    } else {
      dataBase.getRoles(username, (error, roles) => {
        if (error) {
          callback(error);
        } else {
          dataBase.logAccess(username, error => {
            if (error) {
              callback(error);
            } else {
              callback(null, userInfo, roles);
            }
          });
        }
      });
    }
  });
};

const verifyUser_2 = (username, password, callback) =>
  dataBase.verifyUser(username, password, f(username, callback));
const f = (username, callback) => (error, userInfo) =>
  error
    ? callback(error)
    : dataBase.getRoles(username, g(username, userInfo, callback));
const g = (username, userInfo, callback) => (error, roles) =>
  error
    ? callback(error)
    : dataBase.logAccess(username, h(userInfo, roles, callback));
const h = (userInfo, roles, callback) => (error, _) =>
  error ? callback(error) : callback(null, userInfo, roles);

verifyUser_1("Pete", "pass", console.log);
verifyUser_2("Pete", "pass", console.log);
