export interface DataProfileType {
  [key: string]: string;
}

export type TypePayloadProfile = {
  avatar: File | null | undefined | string;
  first_name?: string;
  last_name?: string;
  phone?: string;
};
