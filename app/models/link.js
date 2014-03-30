require('./../mongDb'); //our db file
var mongoose = require('mongoose'); //library file
var crypto = require('crypto');

var urlSchema = mongoose.Schema({
    url: String,
    base_url : String,
    code: String,
    title: String,
    visits: {type: Number, default:0},
    createdAt: { type: Date, default: Date.now }
});

urlSchema.pre("save", function(done){
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    done();
});

var Link = mongoose.model('Link', urlSchema);




module.exports =  Link;