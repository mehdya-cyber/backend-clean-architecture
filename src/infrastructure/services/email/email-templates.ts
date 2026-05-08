export const EmailTemplates = {
  welcome: (params: { name?: string }) => {
    return {
      subject: "Welcome",
      html: `
        <h1>Welcome${params.name ? `, ${params.name}` : ""}</h1>
        <p>Your account has been created successfully.</p>
      `,
      text: `Welcome${params.name ? `, ${params.name}` : ""}. Your account has been created successfully.`,
    };
  },

  passwordReset: (params: { resetUrl: string }) => {
    return {
      subject: "Reset your password",
      html: `
        <h1>Password reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${params.resetUrl}">Reset password</a>
      `,
      text: `Reset your password: ${params.resetUrl}`,
    };
  },

  emailVerification: (params: { verificationUrl: string }) => {
    return {
      subject: "Verify your email",
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${params.verificationUrl}">Verify email</a>
      `,
      text: `Verify your email: ${params.verificationUrl}`,
    };
  },
};
