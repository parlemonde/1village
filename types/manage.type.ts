export interface UserRow {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  school_name: string;
  village_name: string;
  country: string;
  role: string;
}

interface UserFilterProps {
  fullname: string;
  email: string;
  villageName: string;
  country: string;
  type: string;
}

export type UserFilter = Partial<UserFilterProps>;
