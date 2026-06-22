

import transport from "./transport.js";

const resetPasswordMail = async (username, email, resetLink) => {
  const info = await transport.sendMail({
    from: "Task Manager",
    to: email,
    subject: "Task Manager Password Reset",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Reset</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ddd;border-radius:6px;overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#4285F4;padding:40px 30px;">
                  <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:normal;">
                    Reset Your Password
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding:35px 30px;color:#333;">
                  
                  <p style="font-size:16px;">
                    Hi <strong>${username}</strong>,
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    We received a request to reset the password for your account associated with
                    <strong>${email}</strong>.
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    Click the link below to reset your password:
                  </p>

                  <!-- Reset Button -->
                  <div style="text-align:center;margin:30px 0;">
                    <a
                      href="${resetLink}"
                      style="
                        display:inline-block;
                        background:#4285F4;
                        color:#ffffff;
                        text-decoration:none;
                        padding:12px 24px;
                        border-radius:6px;
                        font-size:16px;
                        font-weight:bold;
                      "
                    >
                      Reset Password
                    </a>
                  </div>

                  <p style="font-size:14px;line-height:1.6;">
                    Or copy and paste this link into your browser:
                  </p>

                  <p style="font-size:14px;word-break:break-all;">
                    <a href="${resetLink}" style="color:#4285F4;">
                      ${resetLink}
                    </a>
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    This link will expire in <strong>10 minutes</strong>.
                  </p>

                  <p style="font-size:15px;line-height:1.6;">
                    If you did not request a password reset, please ignore this email. Your password will remain unchanged.
                  </p>

                  <p style="margin-top:35px;">
                    Sincerely,<br />
                    <strong>Task Manager Team</strong>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="
                  background:#fafafa;
                  padding:20px;
                  text-align:center;
                  color:#777;
                  font-size:12px;
                  border-top:1px solid #eee;
                ">
                  This is an automated email. Please do not reply.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  });

  return info;
};

export default resetPasswordMail;