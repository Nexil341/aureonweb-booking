require("dotenv").config();

const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
    throw new Error("Brak RESEND_API_KEY w .env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM =
    process.env.EMAIL_FROM || "AUREONWEB <onboarding@resend.dev>";

// Zamienia znaki specjalne HTML, żeby dane od użytkownika
// nie mogły wstrzyknąć kodu do treści maila.
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

async function sendEmail({ to, subject, html, replyTo }) {
    const { data, error } = await resend.emails.send({
        from: EMAIL_FROM,
        to,
        subject,
        html,
        // "Odpowiedz" w skrzynce odbiorcy trafi na ten adres
        ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
        console.error("Resend error:", error);
        throw new Error("Nie udało się wysłać wiadomości e-mail.");
    }

    return data;
}

module.exports = { sendEmail, escapeHtml };