
import transport from "./transport.js";


const loginAlert = async (
  username,
  email,
  loginTime
) => {
  await transport.sendMail({
    from: "Task Manager",
    to: email,
    subject: "Security Alert: New Login Detected",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Login Alert</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:30px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #ddd;border-radius:6px;overflow:hidden;">

              <!-- Header -->
              <tr>
                <td style="background:#EA4335;padding:40px 30px;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:normal;">
                    Login Alert
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
                    We detected a login to your Task Manager account from a new device.
                  </p>

                  <!-- Login Details -->
                  <div style="
                    background:#f8f9fa;
                    border:1px solid #e5e7eb;
                    border-radius:8px;
                    padding:20px;
                    margin:25px 0;
                  ">
                    <p><strong>Login Time:</strong> ${loginTime}</p>
                  </div>

                  <p style="font-size:15px;line-height:1.6;">
                    If this was you, no further action is required.
                  </p>

                  <p style="font-size:15px;line-height:1.6;color:#d93025;">
                    If you do not recognize this login, immediately change your password and review your account security settings.
                  </p>

                  <p style="margin-top:35px;">
                    Stay safe,<br />
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
                  This is an automated security notification. Please do not reply.
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
};


export default loginAlert;