import dotenv from "dotenv";
dotenv.config();

export default {
  db: {
    dbHost: process.env.DB_HOST!,
    dbPort: process.env.DB_PORT!,
    dbUser: process.env.DB_USER!,
    dbPassword: process.env.DB_PASSWORD!,
    dbName: process.env.DB_NAME!,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME!,
    api_key: process.env.API_KEY!,
    api_secret: process.env.API_SECRET!,
    folderPath: process.env.FOLDER_PATH!,
    publicId_prefix: process.env.PUBLIC_ID_PREFIX!,
  },
  port: process.env.SERVER_PORT!,
  googlePass: process.env.PASS_EMAIL_GOOGLE!,
  jwt: {
    accessKey: process.env.JWT_ACCESS_SECRET_KEY!,
    refreshKey: process.env.JWT_REFRESH_SECRET_KEY!,
  },
  facebook: {
    app_id: process.env.FACEBOOK_APP_ID,
    app_secret: process.env.FACEBOOK_APP_SECRET,
    app_callback_url: "http://localhost:3000/auth/facebook/callback",
  },
  redis: {
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
    uri: process.env.REDIS_URI,
  },
};
