export type Account = {
  id: number;
  firstname: string;
  lastname: string;
};

export type ContextType = {
  account: Account | null;
  isConnected: boolean;
  authenticate: () => void;
  logout: () => void;
};
