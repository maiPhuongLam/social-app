export interface CustomRequest extends Request {
  userId: number; // Change the type to match your actual userId type
}

export type UserQuery = {
  email?: string | Record<string, any>;
  name?: string | Record<string, any>;
};

export type UserCreateInput = {
  email: string;
  name: string;
  phone: string;
  gender: Gender;
  dateOfBirth: Date;
  type: UserTypes;
  password: string;
  // post: object[];
};

export type UserLoginInput = {
  email: string;
  password: string;
};

export enum UserTypes {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export type UserUpdateInput = {
  email?: string;
  name?: string;
  avatar?: string;
  avatarPublicId?: string;
  password?: string;
  otp?: number;
  otpExpiryTime?: Date;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: Date;
};

export type FormateData = {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: any;
};
