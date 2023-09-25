export interface IUser {
  id: string;
  name: string;
  email: string;
  slug: string;
  age: number;
  address: string;
  gender: string;
  following: IUser[];
  followed: IUser[];
  friends: IUser[];
  avatar: string;
  role: string;
}
