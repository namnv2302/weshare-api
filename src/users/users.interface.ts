export interface IUser {
  id: string;
  name: string;
  email: string;
  slug: string;
  age: number;
  address: string;
  gender: string;
  follows: IUser[];
  avatar: string;
  role: string;
}
