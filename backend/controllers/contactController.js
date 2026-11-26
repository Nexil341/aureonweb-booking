const { sendEmail, escapeHtml } = require("../config/email");

// Czytelne nazwy do maila (frontend wysyła klucze)
const PROJECT_TYPES = {
    website: "Strona internetowa",
    webapp: "Aplikacja webowa",
    automation: "Automatyzacja",
    other: "Inne",
};

const BUDGETS = {
    under500: "do 500 zł",
    "500to1500": "500–1500 zł",
    "1500to5000": "1500–5000 zł",
    over5000: "powyżej 5000 zł",
    unknown: "Nie wiem",
    "": "Nie podano",
};

function contactEmailTemplate({ name, email, projectType, budget, message }) {
    const row = (label, value) => `
        <tr>
          <td style="padding:8px 0;color:#71717a;width:140px;vertical-align:top">${label}</td>
          <td style="padding:8px 0;color:#ffffff">${escapeHtml(value)}</td>
        </tr>`;

    return `
    <div style="background:#08080d;padding:40px 20px;font-family:Arial,sans-serif;color:#ffffff">
      <div style="max-width:600px;margin:auto;background:#11111b;border:1px solid #29213b;border-radius:20px;padding:32px">
        <h1 style="color:#a78bfa;letter-spacing:3px;font-size:22px">AUREONWEB</h1>
        <h2 style="font-size:21px;margin-top:24px">Nowe zapytanie z formularza</h2>

        <table style="width:100%;margin-top:16px;font-size:14px;border-collapse:collapse">
          ${row("Imię", name)}
          ${row("E-mail", email)}
          ${row("Rodzaj projektu", PROJECT_TYPES[projectType])}
          ${row("Budżet", BUDGETS[budget])}
        </table>

        <div style="margin-top:20px;padding:18px;background:#1a1528;border-radius:12px;color:#e4e4e7;line-height:1.7;white-space:pre-wrap;font-size:14px">${escapeHtml(message)}</div>

        <p style="color:#71717a;font-size:12px;margin-top:24px">
          Kliknij „Odpowiedz”, aby napisać bezpośrednio do klienta.
        </p>
      </div>
    </div>
  `;
}

const sendContactMessage = async (req, res, next) => {
    try {
        const { name, email, projectType, budget, message, website } = req.body;

        // Honeypot wypełniony = bot.
        // Odpowiadamy "sukces", żeby bot nie wiedział, że go wykryliśmy.
        if (website) {
            console.warn("[CONTACT] Odrzucono wiadomość od bota (honeypot)");
            return res.status(200).json({ message: "Wiadomość wysłana" });
        }

        const contactEmail = process.env.CONTACT_EMAIL;

        if (!contactEmail) {
            throw new Error("Brak CONTACT_EMAIL w .env");
        }

        // Usuwamy znaki nowej linii z tematu maila
        const safeName = name.replace(/[\r\n]+/g, " ");

        await sendEmail({
            to: contactEmail,
            replyTo: email,
            subject: `Nowe zapytanie — ${safeName}`,
            html: contactEmailTemplate({
                name,
                email,
                projectType,
                budget,
                message,
            }),
        });

        return res.status(200).json({ message: "Wiadomość wysłana" });
    } catch (error) {
        next(error);
    }
};

module.exports = { sendContactMessage };