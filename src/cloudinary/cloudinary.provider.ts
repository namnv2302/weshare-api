import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dgclqi8lj',
      api_key: '738162186464553',
      api_secret: 'vYFKGoDvm5uKOBkiB4U5HPxrtKc',
    });
  },
};
