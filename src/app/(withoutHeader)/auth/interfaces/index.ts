export interface IRegister {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}
