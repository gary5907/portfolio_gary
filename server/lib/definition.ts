export type UserType = {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type ParsedNewSkill = {
  name: string;
  image_url: File;
};
