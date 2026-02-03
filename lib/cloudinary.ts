import { v2 as cloudinary } from 'cloudinary';

function configureCloudinary() {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
}

export async function uploadToCloudinary(file: Buffer, filename: string) {
  configureCloudinary();
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Cloudinary credentials are not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: `voting_app/${Date.now()}_${filename}`,
        folder: 'voting_app',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(file);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  configureCloudinary();
  return cloudinary.uploader.destroy(publicId);
}

export function getCloudinaryUrl(publicId: string) {
  configureCloudinary();
  return cloudinary.url(publicId, {
    secure: true,
  });
}
