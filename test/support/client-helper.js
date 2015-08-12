module.exports = (function() {
  var spawn = require('child_process').spawn;

  var ClientHelper = function() {};

  ClientHelper.spawn = function(name) {
    var file = 'scripts/client-emulator/client.js'

    var client = spawn('node', [file, name, 1]);
    client.stdout.on('data', function (data) {
        // console.log(name + ': ' + data);
    });

    client.stderr.on('data', function (data) {
        console.log(name + ': ' + data);
    });

    return client;
  };

  ClientHelper.doTestWithUsers = function(socketIO, users, testFunction, done) {
    var clients = users.map(function(user) {return ClientHelper.spawn(user)});

    ClientHelper._waitForConnect(socketIO, users, function() {
      testFunction(clients, function(err) {
        clients.forEach(function(client) {client.kill();});
        done(err);
      });
    });
  };

  ClientHelper._waitForConnect = function(socketIO, users, done) {
    if (ClientHelper._checkAllSocketAreRegistered(socketIO, users)) {
      done();
    } else {
      setTimeout(ClientHelper._waitForConnect.bind(this, socketIO, users, done), 10);
    }
  };

  ClientHelper._checkAllSocketAreRegistered = function(socketIO, users) {
    return users.every(function(user) {
      var socket = socketIO.socket(user);
      return socket && socket.handshake.user.id == user;
    });
  }

  return ClientHelper;
})();
