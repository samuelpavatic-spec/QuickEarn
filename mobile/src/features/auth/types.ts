export interface LoginCredentials {
  email: string;
  password?: string; // Optional if using OAuth or similar later, but required for now
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password?: string;
  country: string;
  referralCode?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  balance: string;
  referralCode: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
