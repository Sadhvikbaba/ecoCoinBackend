import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET , 
});
    
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (! localFilePath) return null;

        const respose = await cloudinary.uploader.upload(localFilePath , {
            resource_type : "auto"
        })

        fs.unlinkSync(localFilePath);
        return respose ;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null ;
    }
} 

const deleteFileByUrl = async(url) => {
    try {
        if(!url) return null;
        
        const publicId = extractPublicId(url);
    
        const result = await cloudinary.uploader.destroy(publicId);

        if(result) return true;
    } catch (error) {
        return null
    }
}

export {uploadOnCloudinary , deleteFileByUrl}