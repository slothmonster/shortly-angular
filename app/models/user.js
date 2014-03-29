require('./../mongDb'); //our db file
var mongoose = require('mongoose'); //library file
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
bcrypt = Promise.promisifyAll(bcrypt);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", function(done){
     //var cipher = Promise.promisify(bcrypt.hash);
    bcrypt.hashAsync(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash;
        console.log("Hash",hash);
        done(); 
      });

});

userSchema.methods.comparePassword = function(attemptedPassword,callback){
  console.log("compare account");

    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
      console.log("match",isMatch);
      callback(isMatch);
    });
};


var User = mongoose.model('User', userSchema);


module.exports =  User;