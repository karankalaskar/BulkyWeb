export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  companyId?: number;
  phoneNumber?: string;
  role?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  expiration: string;
}