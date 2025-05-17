import mongoose from 'mongoose';
const { Schema } = mongoose;

const uploadFileSchema = new Schema({
 uplaodFiles : { type: String }
  
}, { timestamps: true })

const UploadFile = mongoose.model("UploadFile", uploadFileSchema);

export default UploadFile;
