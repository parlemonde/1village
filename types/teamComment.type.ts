export interface TeamComment {
  id: number;
  type: TeamCommentType;
  createdAt: Date;
  updatedAt: Date;
  comment: string;
}

export enum TeamCommentType {
  GLOBAL,
  COUNTRY,
  VILLAGE,
  CLASSROOM,
}
