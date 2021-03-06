var AWS = require("aws-sdk");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
AWS.config.loadFromPath('./config.json');
var cw = new AWS.CloudWatch({
  apiVersion: '2010-08-01'
});

class Update3DSCodes {
  constructor() {
    var num;
    MongoClient.connect(url, function(err, client) {
      var db = client.db('bot');
      db.collection('users').count({
        dsCode: {
          $ne: "-1"
        }
      }, function(err, results) {
        num = results;
        client.close();
        var params = {
          MetricData: [{
            MetricName: 'Nintendo 3DS Codes Managed',
            Dimensions: [{
              Name: 'Statistics',
              Value: 'Codes'
            }, ],
            Unit: 'None',
            Value: num
          }, ],
          Namespace: 'RosalinaBot'
        };

        cw.putMetricData(params, function(err, data) {
          if (err) {
            console.log("⛈  CloudWatch Put Error: ", err);
          } else {
            console.log("☁️  Put " + num + " Nintendo 3DS friend codes to CloudWatch");
          }
        });
      });
    });
  }
}

module.exports = Update3DSCodes;
