import {Plant} from "../models/plant.models.js";
import {User} from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { extractText } from "../utils/extractText.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadImageToImagga } from "../utils/analyzeImage.js"; 

export const uploadImage = asyncHandler(async (req,res) => {
    const userId = req.user._id;

    let imageLocalPath = req.file.path;

    if (!imageLocalPath) throw new ApiError(400, "Image needed");

    const extractedText = await extractText(imageLocalPath);

    //console.log(extractedText);

    if(!extractedText) throw new ApiError(400 , "image from gps map camera is required");

    let response = await uploadImageToImagga(imageLocalPath);

    response = response?.result?.tags


    const termsToFind = ["plant", "herb"];

    let filteredObjects = response.filter((item) => {
      return termsToFind.includes(item.tag.en.toLowerCase()) && item.confidence > 60;});

    if(!filteredObjects) throw new ApiError(401 , "sorry you image is not upto the level for acceptence");

    const cloudRes = await uploadOnCloudinary(imageLocalPath);

    const plantRes = await Plant.create({
      owner : userId ,
      location : extractedText ,
      imageUrl : cloudRes?.url || ""
    })

    const user = await User.findById(userId);

    user.coins += 5;

    const updatedUser = await user.save()
      

   res.status(200).json(new ApiResponse(200, {data : extractedText , tags : filteredObjects , user : updatedUser} , "image accepted successfully"));

    

    
});

