export interface IUser {
  user: {
    id: number;
    name: string;
    email: string;
    type: string;
  };
  iat: number;
  exp: number;
}
