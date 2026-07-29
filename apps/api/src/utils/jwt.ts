import jwt from "jsonwebtoken";

type AccessTokenPayload = {
  userId: string;
  email: string;
  role: string;
};

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });
}

type RefreshTokenPayload = {
  userId: string;
};

export function generateRefreshToken(
  payload: RefreshTokenPayload
): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
} 