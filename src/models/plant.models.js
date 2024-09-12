import mongoose ,{Schema} from "mongoose";

const plantSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    place: [{
        type : Number,
    }],
    owner : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
} , {timestamps:true})


export const Plant = mongoose.model('Plant', plantSchema);