export interface User {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImageUrl?: string;
  address: Address;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Address {
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string; // PIN code for India
  country: string; // should be 'India'
  isDefault?: boolean;
  addressType?: 'home' | 'work' | 'other';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export type PartialUser = Partial<User>;
