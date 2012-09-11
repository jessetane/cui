/*
 *  aws.js
 *
 */


var ec2 = require("ec2");
var config = {};


exports.operator = function (operator) {
  return {
    operations: {
      show: [
        function ()
        exports.show
      ]
    }
  }
}

exports.configure = function (data) {
  if (typeof data != "string") config = data
  else config = require(data);
  if (config.aws) config = config.aws;
}

exports.endpoint = function (region) {
  return ec2({
    key: config.key,
    secret: config.secret,
    endpoint: region || "us-east-1"
  });
}

exports.show = function () {
  ec2 = exports.endpoint();
  ec2("DescribeInstances", {}, function (err, data) {
    console.log(data);
  });
}
