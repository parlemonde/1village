export interface TeamCommentInterface {
  id: number;
  type: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  text: string;
}

export enum TeamCommentType {
  DASHBOARD_GLOBAL = 0,
  DASHBOARD_VILLAGE = 1,
  DASHBOARD_COUNTRY = 2,
}
