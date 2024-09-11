import mongoose ,{Schema} from "mongoose";

const plantSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required:true
    },
    owner : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} , {timestamps:true})


export const Plant = mongoose.model('Plant', plantSchema);