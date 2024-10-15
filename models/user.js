const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const user = new Schema({
    id: { type: ObjectId }, //khóa chính
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
});
module.exports = mongoose.models.user || mongoose.model('user', user);
// category -----> categories
