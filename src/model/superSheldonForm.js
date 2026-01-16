const mongoose = require("mongoose");
const { Schema } = mongoose;

const superSheldonFormSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    mobile: {
        type: String,
        required: true,
        immutable: true
    },
    childAgeYear: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ['english', 'maths', 'both']
    }
}, {
    timestamps: true
});

const SuperSheldonForm = mongoose.model("super_sheldon_form", superSheldonFormSchema);

module.exports = SuperSheldonForm;

