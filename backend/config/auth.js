require("dotenv").config();

const { betterAuth } = require("better-auth");
const { emailOTP } = require("better-auth/plugins");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const prisma = require("./prisma");
const { sendEmail, escapeHtml } = require("./email");

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

function codeEmailTemplate({ title, message, code }) {
    return `
    <div style="background:#08080d;padding:40px 20px;font-family:Arial,sans-serif;color:#ffffff">
      <div style="max-width:520px;margin:auto;background:#11111b;border:1px solid #29213b;border-radius:20px;padding:32px">
        <h1 style="color:#a78bfa;letter-spacing:3px;font-size:22px">AUREONWEB</h1>

        <h2 style="font-size:23px;margin-top:30px">${escapeHtml(title)}</h2>

        <p style="color:#a1a1aa;line-height:1.8">${escapeHtml(message)}</p>

        <div style="margin-top:22px;padding:18px;background:#1a1528;border-radius:12px;text-align:center;font-size:32px;font-weight:bold;letter-spacing:10px;color:#ffffff">
          ${escapeHtml(code)}
        </div>

        <p style="color:#71717a;font-size:12px;margin-top:30px;line-height:1.7">
          Kod jest ważny przez 10 minut. Nikomu go nie podawaj.
          Jeśli nie zakładałeś konta, zignoruj tę wiadomość.
        </p>
      </div>
    </div>
  `;
}

const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [
        process.env.FRONTEND_URL || "http://localhost:3000",
    ],

    // ==========================================
    // LOGOWANIE E-MAIL + HASŁO, RESET HASŁA
    // ==========================================
    emailAndPassword: {
        enabled: true,

        // Logowanie możliwe dopiero po potwierdzeniu e-maila.
        requireEmailVerification: true,

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

    // ==========================================
    // WERYFIKACJA E-MAILA LINKIEM
    // (używana przy zmianie adresu e-mail)
    // ==========================================
    emailVerification: {
        expiresIn: 3600,

        // Po poprawnej weryfikacji użytkownik jest od razu zalogowany.
        autoSignInAfterVerification: true,

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

    // ==========================================
    // ZMIANA ADRESU E-MAIL
    // ==========================================
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

    // ==========================================
    // KOD WERYFIKACYJNY PRZY REJESTRACJI
    // ==========================================
    plugins: [
        emailOTP({
            otpLength: 6,
            expiresIn: 600,       // 10 minut
            allowedAttempts: 5,   // po 5 błędnych próbach kod przepada
            sendVerificationOnSignUp: true,

            // false: kod tylko przy rejestracji.
            // Zmiana e-maila musi używać linku z tokenem (niesie nowy adres),
            // dlatego nie podmieniamy domyślnej weryfikacji na kody.
            overrideDefaultEmailVerification: false,

            async sendVerificationOTP({ email, otp, type }) {
                // Na razie obsługujemy tylko weryfikację e-maila.
                // Logowanie kodem i reset hasła kodem nie są włączone.
                if (type !== "email-verification") {
                    return;
                }

                // Tylko w trybie deweloperskim: kod w terminalu,
                // żeby dało się testować bez dostępu do skrzynki.
                if (process.env.NODE_ENV !== "production") {
                    console.log(`[DEV] Kod weryfikacyjny dla ${email}: ${otp}`);
                }

                await sendEmail({
                    to: email,
                    subject: "Kod weryfikacyjny — AUREONWEB",
                    html: codeEmailTemplate({
                        title: "Potwierdź adres e-mail",
                        message:
                            "Wpisz poniższy kod na stronie AUREONWEB, aby zweryfikować swoje konto.",
                        code: otp,
                    }),
                });
            },
        }),
    ],
});

module.exports = { auth };