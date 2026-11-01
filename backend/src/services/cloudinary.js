const cloudinary = require('cloudinary').v2;
cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports = {
uploadStream: (stream, options={}) => {
return new Promise((resolve, reject)=>{
const upload = cloudinary.uploader.upload_stream(options, (err, res)=>{
if(err) return reject(err); resolve(res); });
stream.pipe(upload);
});
},
generateSignedUploadParams: (folder='forms') => {
// For demo: return unsigned preset instructions or server-side signature logic
return { cloud_name: process.env.CLOUDINARY_CLOUD_NAME, folder };
}
}