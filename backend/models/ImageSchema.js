import mongoose from "mongoose";
 
const imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
 
//Image is a model which has a schema imageSchema
 
const imageModel = new mongoose.model('Image', imageSchema);

export default imageModel;