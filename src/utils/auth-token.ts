import * as jwt from "jsonwebtoken";

export const generateToken = async (
  payload: { id: number; email: string },
  key: string
) => {
  const token = jwt.sign(payload, key, {
    expiresIn: key === process.env.JWT_ACCESS_SECRET_KEY! ? "1h" : "7d",
  });

  return token;
};

export const validateToken = async (token: string, key: string) => {
  const payload = (await jwt.verify(token, key)) as {
    id: number;
    email: string;
  };
  return payload;
};
