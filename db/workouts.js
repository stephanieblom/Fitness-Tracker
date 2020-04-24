const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let workout = new Schema ({
   date: { type: Date, default: Date.now },
   totalDuration: {type: Number, default: 0},
   exercises : [ {type: Schema.Types.ObjectId, ref: 'exercise'} ],
} );

module.exports = mongoose.model('workout', workout);

