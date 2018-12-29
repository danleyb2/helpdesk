var mongoose = require('mongoose');

var TagSchema = mongoose.Schema({
    name:       { type: String, required: true},
    normalized: String
});

TagSchema.pre('save', function(next) {
    this.name = this.name.trim();
    this.normalized = this.name.toLowerCase().trim();

    return next();
});


module.exports = mongoose.model('Tag', TagSchema);
