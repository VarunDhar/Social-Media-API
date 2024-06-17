const cloudinary = require("cloudinary").v2;

exports.imageUploader = async (file,folder,quality,height) =>{
    try {
        
        const options = {folder};
        if(quality){
            options.quality = quality;
        }
        if(height){
            options.height = height;
        }
        options.resource_type = "auto";

        const response = await cloudinary.uploader.upload(file.path,options);
        return response;

    } catch (error) {
        console.log("ERROR: uploading image to cloudinary : ",error);
        return;1
    }
}

