export interface RegisterFormData {
  full_name: string;
  email: string;
  age: number;
  phone_number?: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface VerificationData {
  email: string;
  code: number;
} 

export interface PasswordResetData {
  email: string;
  new_password: string;
  confirm_password: string;
}



