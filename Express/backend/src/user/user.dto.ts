export type UserRole = 0 | 1 | 2;

export interface UserEntity extends CreateUserDto {
  readonly salt: string;
}

export interface CreateUserDto extends LoginDto {
  readonly nickname: string;
  readonly email: string;
  readonly role: UserRole;
  readonly name: string;
}

export interface UpdateUserDto {
  readonly nickname?: string;
  readonly email?: string;
}

export interface LoginDto {
  readonly id: string;
  readonly password: string;
}