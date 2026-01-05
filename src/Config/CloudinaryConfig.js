    // cloudinaryConfig.js

import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration setup
cloudinary.config({
  cloud_name: "dxxltlx2l",       // 👈 Replace with your own cloud name
  api_key: "246614275852679",       // 👈 Replace with your Cloudinary API Key
  api_secret: "D-hZsE1NAE1Xd8qPEfRPQ9AHU3Y", // 👈 Replace with your Cloudinary API Secret
  secure: true,                  // 👈 Ensures https (secure upload)
});

export default cloudinary;
