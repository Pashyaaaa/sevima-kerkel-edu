export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

// Extend tipe Request Express agar mengenali properti `user` dari middleware
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
