const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const productSize = new Schema({
    product: { type: ObjectId, ref: 'product' },
    size: { type: ObjectId, ref: 'size' }
});
module.exports = mongoose.models.productSize || mongoose.model('productSize', productSize);
