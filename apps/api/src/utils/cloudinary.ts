import cloudinary from "../config/cloudinary.ts";
import type { UploadApiResponse } from "cloudinary";

export const uploadImage = (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result."));
          return;
        }

        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};