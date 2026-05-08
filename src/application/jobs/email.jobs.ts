export type TWelcomeEmailJobData = {
  type: "WELCOME_EMAIL";
  to: string;
  payload: {
    name: string;
  };
};

export type TPasswordResetEmailJobData = {
  type: "PASSWORD_RESET_EMAIL";
  to: string;
  payload: {
    resetUrl: string;
  };
};

export type TEmailVerificationJobData = {
  type: "EMAIL_VERIFICATION";
  to: string;
  payload: {
    verificationUrl: string;
  };
};

export type TEmailJobData =
  | TWelcomeEmailJobData
  | TPasswordResetEmailJobData
  | TEmailVerificationJobData;

export type TEmailJobType = TEmailJobData["type"];
