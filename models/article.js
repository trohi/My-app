var mongoose = require("mongoose");
var Schema = mongoose.Schema;

articleSchema = new Schema({
    author: {type:String, required: true},
    publicationDate:  {type:String, required:true},
    title: {type:String, required: true},
    content: {type:String, required:true}
});


module.exports = mongoose.model('Article', articleSchema);
