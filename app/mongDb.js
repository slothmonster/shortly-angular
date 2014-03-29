var mongoose = require('mongoose');
 
var path = process.env.MONGODB ||'mongodb://127.0.0.1:27017/shorty';

mongoose.connect(path, function(err){

});
