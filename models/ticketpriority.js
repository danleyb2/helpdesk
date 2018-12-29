/*
     .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 Created:    5/28/2018
 Author:     Chris Brame

 **/

// var _               = require('lodash');
var mongoose        = require('mongoose');
var moment          = require('moment');
                      require('moment-duration-format');

var COLLECTION = 'priorities';

var prioritySchema = mongoose.Schema({
    organization:   { type: mongoose.Schema.Types.ObjectId, ref: 'organizations', required: true },


    name:         { type: String, required: true },
    overdueIn:    { type: Number, required: true, default: 2880 }, // Minutes until overdue (48 Hours)
    htmlColor:    { type: String, default:  '#29b955' },

    migrationNum: { type: Number, index: true }, //Needed to convert <1.0 priorities to new format.
    default:      { type: Boolean }
}, {
    toJSON: {
        virtuals: true
    }
});

prioritySchema.index({organization : 1, name: 1}, {unique: true});

prioritySchema.pre('save', function(next) {
    this.name = this.name.trim();

    return next();
});

prioritySchema.virtual('durationFormatted').get(function() {
    var priority = this;
    return moment.duration(priority.overdueIn, 'minutes').format('Y [year], M [month], d [day], h [hour], m [min]', {trim: 'both'});
});

prioritySchema.statics.getPriority = function(_id, callback) {
    return this.model(COLLECTION).findOne({_id: _id}).exec(callback);
};

prioritySchema.statics.getPriorities = function(callback) {
    return this.model(COLLECTION).find({}).exec(callback);
};

prioritySchema.statics.getOrganizationPriorities = function(org,callback) {
    return this.model(COLLECTION).find({organization:org._id}).exec(callback);
};

prioritySchema.statics.getByMigrationNum = function(num, callback) {
    var q = this.model(COLLECTION).findOne({migrationNum: num});

    return q.exec(callback);
};

prioritySchema.statics.getOrganizationByMigrationNum = function(organization,num, callback) {
    var q = this.model(COLLECTION).findOne({organization:organization._id, migrationNum: num});

    return q.exec(callback);
};

module.exports = mongoose.model(COLLECTION, prioritySchema);
