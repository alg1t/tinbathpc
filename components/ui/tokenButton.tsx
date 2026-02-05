export function tokenButton({
  rawToken,
  buttonLabel = "Reset Password", //default
}: {
  rawToken: string;
  buttonLabel?: string;
}): string {
  const resetUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;

  return `
    <div style="font-family: Arial, sans-serif;padding: 20px;">
      <h2>Password Reset Request</h2>
      <p>If you requested a password reset, please click the button below:</p>
      <a href="${resetUrl}"
         style="
           display: inline-block;
           padding: 12px 24px;
           background-color: #0008f3;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
           margin-top: 12px;
         ">
        ${buttonLabel}
      </a>
      <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  `;
}
// import React from 'react';

// interface PasswordResetEmailProps {
//   token: string;
//   appUrl: string;
//   buttonLabel?: string;
//   userName?: string;
// }

// export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
//   token,
//   appUrl,
//   buttonLabel = 'Reset Password',
//   userName = 'there',
// }) => {
//   const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

//   return (
//     <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', textAlign: 'center' }}>
//       <h2>Password Reset Request</h2>
//       <p>Hi {userName},</p>
//       <p>If you requested a password reset, click the button below:</p>
//       <a
//         href={resetUrl}
//         style={{
//           display: 'inline-block',
//           padding: '12px 24px',
//           backgroundColor: '#0070f3',
//           color: '#ffffff',
//           textDecoration: 'none',
//           borderRadius: '6px',
//           fontWeight: 'bold',
//           marginTop: '12px',
//         }}
//       >
//         {buttonLabel}
//       </a>
//       <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
//         If you didn’t request this, you can safely ignore this email.
//       </p>
//     </div>
//   );
// };

// <PasswordResetEmail
//   token="abc123"
//   appUrl="https://yourapp.com"
//   userName="Alan"
// />
