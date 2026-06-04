export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TasksStackParamList = {
  TaskList: undefined;
  TaskDetails: { taskId: string };
};

export type MainTabParamList = {
  Tasks: undefined; // This will point to TasksStack
  Wallet: undefined;
  Referrals: undefined;
  Profile: undefined;
};
