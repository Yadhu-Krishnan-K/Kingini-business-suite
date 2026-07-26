export interface RegisterUserDto {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface RegisteredUserDto {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
}