import mongoose from 'mongoose';
const itemSchema = mongoose.Schema({
image:String
},{ timestamps: true })

const Item = mongoose.model('Item',itemSchema);
export default Item;