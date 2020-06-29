#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

var connection = amqp.createConnection({ host: 'ms-rabbitmq', port: 5671, password: 'sgseistgeil', login: 'testmanager', connectionTimeout: 10000});

connection.createChannel(function(error1, channel) {
  if (error1) {
    throw error1;
  }

  var queue = 'hello';
  var msg = 'Hello World! From Tierarzt!';

  channel.assertQueue(queue, {
    durable: false
  });
  channel.sendToQueue(queue, Buffer.from(msg));

  console.log(" [x] Sent %s", msg);
});
setTimeout(function() {
  connection.close();
  process.exit(0);
}, 500)
