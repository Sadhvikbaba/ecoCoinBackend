import mongoose ,{Schema} from "mongoose";

const plantSchema = new Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
} , {timestamps:true})

plantSchema.index({ location: '2dsphere' });

export const Plant = mongoose.model('Plant', plantSchema);