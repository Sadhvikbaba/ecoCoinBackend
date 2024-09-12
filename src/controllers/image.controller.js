import {Plant} from "../models/plant.models.js";
import {User} from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { extractText } from "../utils/extractText.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadImageToImagga } from "../utils/analyzeImage.js"; 
import fs from "fs";

export const uploadImage = asyncHandler(async (req,res) => {
    const userId = req.user._id;

    let imageLocalPath = req.file.path;

    if (!imageLocalPath) throw new ApiError(400, "Image needed");

    let extractedText = await extractText(imageLocalPath);

    //console.log(extractedText);
    if(!extractedText) throw new ApiError(400 , "image from gps map camera is required");

    const regex = /Lat\s([0-9.]+)[^\d]+Long\s([0-9.]+)/;
    const match = extractedText.match(regex);


    if(!match.length>2) throw new ApiError(400 , "proper image is required");

    const lat = Number( match[1]);
    const long = Number( match[2]);

    const exsistedPlant = await Plant.findOne({place : [lat , long]});

    if(exsistedPlant){ 
      fs.unlinkSync(imageLocalPath);
      throw new ApiError(400 , "plant has already registered");
    }

    /*let response = await uploadImageToImagga(imageLocalPath);
    console.log(response);

    response = response?.result?.tags

    const termsToFind = ["plant", "herb"];

    let filteredObjects = response?.filter((item) => {
      return termsToFind.includes(item.tag.en.toLowerCase()) && item.confidence > 60;});

    if(!filteredObjects) throw new ApiError(401 , "sorry you image is not upto the level for acceptence");*/

    const cloudRes = await uploadOnCloudinary(imageLocalPath);

    const plantRes = await Plant.create({
      owner : userId ,
      place : [lat,long],
      imageUrl : cloudRes?.url || ""
    })

    const user = await User.findById(userId);

    user.coins += 5;

    const updatedUser = await user.save()

    delete updatedUser.refreshToken
    delete updatedUser.password

   res.status(200).json(new ApiResponse(200, {extractedText : [lat , long] , image : plantRes ,user : updatedUser } , "image accepted successfully"));

    

    
});

