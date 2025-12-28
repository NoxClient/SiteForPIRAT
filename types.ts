export enum ViewState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD'
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export interface User {
  username: string;
  email: string;
}