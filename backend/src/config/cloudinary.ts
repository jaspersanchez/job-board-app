import { v2 as cloudinary } from "cloudinary";
import { env } from "../utils/env";

const { cloud_name, api_key, api_secret } = env;

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

export default cloudinary;
