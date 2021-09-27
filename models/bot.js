const mongoose = require ('mongoose');
const Schema  = mongoose.Schema;

const botSchema = new Schema({
    link: {
        type: String,
        required: true
    },
    counter: {
        type: Number,
        required: true
    }
},
{timestamps: true });

const Links = mongoose.model('Links', botSchema);

module.exports = Links;
