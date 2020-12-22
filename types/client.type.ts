export interface Client {
  id: string;
  secret?: string;
  name: string;
  redirectUri: string;
  isConfidential: boolean;
}
