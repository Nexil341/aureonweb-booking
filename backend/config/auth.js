
require("dotenv").config();

const { betterAuth } = require("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const { Resend } = require("resend");
const prisma = require("./prisma");

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
    process.env.EMAIL_FROM || "AUREONWEB <onboarding@resend.dev>";

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });
}

function emailTemplate({ title, message, url, button }) {
    return `
    <div style="background:#08080d;padding:40px 20px;font-family:Arial,sans-serif;color:#ffffff">
      <div style="max-width:520px;margin:auto;background:#11111b;border:1px solid #29213b;border-radius:20px;padding:32px">
        <h1 style="color:#a78bfa;letter-spacing:3px;font-size:22px">
          AUREONWEB
        </h1>

        <h2 style="font-size:23px;margin-top:30px">
          ${escapeHtml(title)}
        </h2>

        <p style="color:#a1a1aa;line-height:1.8">
          ${escapeHtml(message)}
        </p>

        <a href="${escapeHtml(url)}"
          style="display:inline-block;background:#7c3aed;color:white;padding:15px 24px;border-radius:10px;text-decoration:none;font-weight:bold;margin-top:18px">
          ${escapeHtml(button)}
        </a>

        <p style="color:#71717a;font-size:12px;margin-top:30px;line-height:1.7">
          Jeśli nie wykonywałeś tej operacji, zignoruj wiadomość.
        </p>
      </div>
    </div>
  `;
}

async function sendEmail({ to, subject, html }) {
    const { data, error } = await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html,
    });

    if (error) {
        console.error("Resend error:", error);
        throw new Error("Nie udało się wysłać wiadomości e-mail.");
    }

    return data;
}

const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [
        process.env.FRONTEND_URL || "http://localhost:3000",
    ],

    emailAndPassword: {
        enabled: true,

        resetPasswordTokenExpiresIn: 3600,

        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Resetowanie hasła — AUREONWEB",
                html: emailTemplate({
                    title: "Resetowanie hasła",
                    message:
                        "Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. Link jest ważny przez 60 minut.",
                    url,
                    button: "Ustaw nowe hasło",
                }),
            });
        },
    },

    emailVerification: {
        expiresIn: 3600,

        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Weryfikacja adresu e-mail — AUREONWEB",
                html: emailTemplate({
                    title: "Potwierdź adres e-mail",
                    message:
                        "Kliknij poniższy przycisk, aby potwierdzić adres e-mail przypisany do Twojego konta.",
                    url,
                    button: "Zweryfikuj e-mail",
                }),
            });
        },
    },

    user: {
        changeEmail: {
            enabled: true,
            updateEmailWithoutVerification: false,

            sendChangeEmailConfirmation: async ({
                user,
                newEmail,
                url,
            }) => {
                await sendEmail({
                    to: user.email,
                    subject: "Zmiana adresu e-mail — AUREONWEB",
                    html: emailTemplate({
                        title: "Potwierdź zmianę e-maila",
                        message:
                            `Otrzymaliśmy prośbę o zmianę adresu e-mail ` +
                            `na ${newEmail}. Potwierdź tę operację.`,
                        url,
                        button: "Potwierdź zmianę",
                    }),
                });
            },
        },
    },
});

module.exports = { auth };
