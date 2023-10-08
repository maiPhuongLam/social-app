export interface UserQuery {
  email?: string | Record<string, any>;
  name?: string | Record<string, any>;
}

export interface UserCreateInput {
  email: string;
  name: string;
  type: UserTypes;
  password: string;
  // post: object[];
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export enum UserTypes {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserUpdateInput {
  email?: string;
  name?: string;
  password?: string;
  otp?: number;
  otpExpiryTime?: Date;
}

export interface FormateData {
  statusCode: number;
  message: string;
  isSuccess: boolean;
  data: any;
}
