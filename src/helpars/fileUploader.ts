import multer from "multer"
import path, { resolve } from "path"
import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import { ICloudinaryResponse } from "../app/interfaces/file";
 

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }

}

)
console.log(path.join(process.cwd(), 'uploads'))
export const upload = multer({ storage: storage })



cloudinary.config({ 
    cloud_name: 'dhxd918cq', 
    api_key: '736225596626671', 
    api_secret: 'cuhi0XY8s8t5V8EDftdd2l_vK9s' 
  });
  
  export const uploadToCloudinary = (file: any) :Promise<ICloudinaryResponse | undefined>=> {
   
      return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
              file.path,
            //   { public_id: file.originalname }, 
              (error:Error, result:ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                  if (error) {
                      reject(error);
                  } else {
                      resolve(result);
                  }
              }
          );
      });
  };
  

 