const mongoose = require('mongoose');

const NumbersSchema = new mongoose.Schema({
    number: { 
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    isAssigned: {
        type: Boolean,
        default: false
    },
    created: {
        type: Number,
        default: Math.floor(Date.now() / 1000)
    },
});

// module.exports = mongoose.model('NumberModel', NumbersSchema);

var numbersSchemaModel = mongoose.model('numbers', NumbersSchema);
module.exports = {
    numbersSchemaModel
}
