import jwt from "jsonwebtoken";


type AccessTokenPayload = {
  userId: string;
  email: string;
  role: string;
};

type RefreshTokenPayload = {
  userId: string;
};


export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(
  payload: RefreshTokenPayload
): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as RefreshTokenPayload;
}