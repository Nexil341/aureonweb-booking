// ==========================================
// TREŚĆ DOKUMENTÓW PRAWNYCH
// ==========================================
// Dane administratora są w jednym miejscu.
// Zmień je tutaj, a zmienią się w obu dokumentach i obu językach.

// UZUPEŁNIJ przed startem: Twoje imię i nazwisko.
// RODO wymaga wskazania, kto jest administratorem danych.
export const ADMIN_NAME = "Sebastian Bińkowski";

export const LEGAL_CONTACT_EMAIL = "nexilsbusinesss@gmail.com";
export const SITE_DOMAIN = "aureonweb.pl";
export const LAST_UPDATED = "26.11.2026";

export type LegalDocumentContent = {
    metaTitle: string;
    metaDescription: string;
    back: string;
    eyebrow: string;
    title: string;
    description: string;
    updated: string;
    contents: string;
    contactTitle: string;
    contactDescription: string;
    sections: {
        title: string;
        items: string[];
    }[];
};

type Locale = "pl" | "en";

// ==========================================
// POLITYKA PRYWATNOŚCI
// ==========================================

const privacyPl: LegalDocumentContent = {
    metaTitle: "Polityka prywatności | AUREONWEB STUDIO",
    metaDescription:
        "Informacje o przetwarzaniu danych osobowych w serwisie AUREONWEB STUDIO.",
    back: "Powrót na stronę główną",
    eyebrow: "DOKUMENTY PRAWNE",
    title: "Polityka prywatności",
    description:
        "Wyjaśniamy, jakie dane zbieramy, w jakim celu, komu je przekazujemy i jakie prawa Ci przysługują.",
    updated: `Ostatnia aktualizacja: ${LAST_UPDATED}`,
    contents: "SPIS TREŚCI",
    contactTitle: "Pytania o Twoje dane?",
    contactDescription:
        "Napisz do nas, jeśli chcesz skorzystać ze swoich praw lub masz pytania dotyczące przetwarzania danych.",
    sections: [
        {
            title: "Administrator danych",
            items: [
                `Administratorem Twoich danych osobowych jest ${ADMIN_NAME}, osoba fizyczna prowadząca serwis ${SITE_DOMAIN} pod nazwą AUREONWEB STUDIO (dalej: „Administrator”).`,
                `We wszystkich sprawach dotyczących danych osobowych możesz skontaktować się z Administratorem pod adresem e-mail: ${LEGAL_CONTACT_EMAIL}.`,
                "Dane przetwarzamy zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) oraz przepisami prawa polskiego.",
            ],
        },
        {
            title: "Jakie dane przetwarzamy",
            items: [
                "Dane konta: imię lub nazwa użytkownika, adres e-mail oraz hasło przechowywane wyłącznie w formie zaszyfrowanej (hash). Nie znamy Twojego hasła.",
                "Dane zamówienia: nazwa firmy, e-mail kontaktowy, numer telefonu, domena, opis projektu, preferowany termin, informacje o posiadanych materiałach oraz linki z inspiracjami — w zakresie, w jakim je podasz.",
                "Wiadomości i zdjęcia przesłane przez czat w panelu klienta.",
                "Dane z formularza kontaktowego: imię, adres e-mail, rodzaj projektu, budżet i treść wiadomości.",
                "Dane o płatnościach: identyfikator i status płatności. Danych karty płatniczej nie przetwarzamy — obsługuje je wyłącznie operator płatności Stripe.",
                "Dane techniczne: adres IP i informacje o przeglądarce, zapisywane przy sesji logowania oraz w celu ochrony serwisu przed nadużyciami.",
            ],
        },
        {
            title: "Cele i podstawy przetwarzania",
            items: [
                "Założenie i prowadzenie konta, przyjęcie i realizacja zamówienia, kontakt w sprawie projektu oraz obsługa czatu — w celu zawarcia i wykonania umowy (art. 6 ust. 1 lit. b RODO).",
                "Odpowiedź na wiadomość z formularza kontaktowego — w celu podjęcia działań na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO) lub w naszym prawnie uzasadnionym interesie, jakim jest odpowiadanie na zapytania (art. 6 ust. 1 lit. f RODO).",
                "Rozliczenia i przechowywanie dokumentów księgowych — w celu wypełnienia obowiązków prawnych, w szczególności podatkowych (art. 6 ust. 1 lit. c RODO).",
                "Zapewnienie bezpieczeństwa serwisu, zapobieganie nadużyciom oraz ustalenie, dochodzenie lub obrona roszczeń — w naszym prawnie uzasadnionym interesie (art. 6 ust. 1 lit. f RODO).",
                "Wysyłka wiadomości e-mail związanych z kontem (kody weryfikacyjne, reset hasła, zmiana adresu e-mail) — w celu wykonania umowy (art. 6 ust. 1 lit. b RODO). Nie wysyłamy newslettera ani reklam.",
            ],
        },
        {
            title: "Komu przekazujemy dane",
            items: [
                "Resend — dostawca usługi wysyłki wiadomości e-mail. Wiadomości są wysyłane z serwerów w Unii Europejskiej (Irlandia).",
                "Stripe — operator płatności online. Płatność odbywa się na stronie Stripe, na zasadach określonych w polityce prywatności Stripe.",
                "Dostawca hostingu — podmiot utrzymujący serwer aplikacji i bazę danych.",
                "Podmioty świadczące usługi księgowe lub prawne — w zakresie niezbędnym do rozliczeń i obsługi ewentualnych roszczeń.",
                "Niektórzy dostawcy (np. Stripe i Resend) należą do grup kapitałowych z siedzibą w USA. Jeśli dane są przekazywane poza Europejski Obszar Gospodarczy, odbywa się to na podstawie decyzji Komisji Europejskiej (np. EU-US Data Privacy Framework) lub standardowych klauzul umownych zatwierdzonych przez Komisję Europejską.",
                "Nie sprzedajemy Twoich danych i nie udostępniamy ich w celach marketingowych.",
            ],
        },
        {
            title: "Jak długo przechowujemy dane",
            items: [
                "Dane konta — do czasu usunięcia konta.",
                "Dane zamówień i dokumenty rozliczeniowe — przez okres wymagany przepisami prawa, w szczególności podatkowymi (co do zasady 5 lat od końca roku, w którym powstał obowiązek podatkowy).",
                "Wiadomości z formularza kontaktowego — do 12 miesięcy od ostatniego kontaktu, chyba że zapytanie przerodzi się w zamówienie.",
                "Dane sesji logowania — do wylogowania lub wygaśnięcia sesji.",
                "Dane przetwarzane w celu dochodzenia lub obrony roszczeń — do upływu okresu przedawnienia tych roszczeń.",
            ],
        },
        {
            title: "Twoje prawa",
            items: [
                "Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania oraz przenoszenia danych.",
                "Masz prawo wnieść sprzeciw wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie.",
                `Aby skorzystać ze swoich praw, napisz na adres ${LEGAL_CONTACT_EMAIL}. Odpowiemy bez zbędnej zwłoki, nie później niż w ciągu miesiąca.`,
                "Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa), jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem.",
            ],
        },
        {
            title: "Dobrowolność i bezpieczeństwo",
            items: [
                "Podanie danych jest dobrowolne, ale niezbędne do założenia konta, złożenia zamówienia lub otrzymania odpowiedzi na wiadomość. Pola oznaczone jako opcjonalne możesz pominąć.",
                "Połączenie z serwisem jest szyfrowane (HTTPS), a hasła przechowujemy wyłącznie w formie zaszyfrowanej.",
                "Dostęp do danych zamówienia, wiadomości i przesłanych zdjęć ma wyłącznie klient, do którego należy zamówienie, oraz Administrator.",
                "Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na zautomatyzowanym przetwarzaniu, w tym profilowaniu.",
            ],
        },
        {
            title: "Zmiany polityki prywatności",
            items: [
                "Polityka prywatności może być aktualizowana, np. w związku ze zmianą przepisów lub funkcji serwisu.",
                "Aktualna wersja jest zawsze dostępna na tej stronie wraz z datą ostatniej aktualizacji.",
                "Zasady korzystania z plików cookies opisuje osobna Polityka cookies.",
            ],
        },
    ],
};

const privacyEn: LegalDocumentContent = {
    metaTitle: "Privacy Policy | AUREONWEB STUDIO",
    metaDescription:
        "Information about personal data processing on the AUREONWEB STUDIO website.",
    back: "Back to homepage",
    eyebrow: "LEGAL DOCUMENTS",
    title: "Privacy Policy",
    description:
        "We explain what data we collect, why, who we share it with and what rights you have.",
    updated: `Last updated: ${LAST_UPDATED}`,
    contents: "CONTENTS",
    contactTitle: "Questions about your data?",
    contactDescription:
        "Contact us if you want to exercise your rights or have questions about how we process your data.",
    sections: [
        {
            title: "Data controller",
            items: [
                `The controller of your personal data is ${ADMIN_NAME}, a natural person running the ${SITE_DOMAIN} website under the name AUREONWEB STUDIO (the "Controller").`,
                `For all matters regarding personal data, you can contact the Controller at: ${LEGAL_CONTACT_EMAIL}.`,
                "We process data in accordance with Regulation (EU) 2016/679 (GDPR) and Polish law.",
            ],
        },
        {
            title: "What data we process",
            items: [
                "Account data: name or username, e-mail address and password stored only in encrypted (hashed) form. We do not know your password.",
                "Order data: company name, contact e-mail, phone number, domain, project description, preferred deadline, information about materials you have and inspiration links — to the extent you provide them.",
                "Messages and images sent via the chat in the client panel.",
                "Contact form data: name, e-mail address, project type, budget and message content.",
                "Payment data: payment identifier and status. We do not process card details — they are handled exclusively by the payment operator Stripe.",
                "Technical data: IP address and browser information, stored with your login session and used to protect the website against abuse.",
            ],
        },
        {
            title: "Purposes and legal bases",
            items: [
                "Creating and maintaining your account, accepting and fulfilling orders, project communication and chat — to conclude and perform a contract (Art. 6(1)(b) GDPR).",
                "Replying to contact form messages — to take steps at your request before entering into a contract (Art. 6(1)(b) GDPR) or in our legitimate interest of responding to enquiries (Art. 6(1)(f) GDPR).",
                "Settlements and keeping accounting records — to comply with legal obligations, in particular tax obligations (Art. 6(1)(c) GDPR).",
                "Ensuring website security, preventing abuse and establishing, pursuing or defending claims — in our legitimate interest (Art. 6(1)(f) GDPR).",
                "Sending account-related e-mails (verification codes, password reset, e-mail change) — to perform the contract (Art. 6(1)(b) GDPR). We do not send newsletters or advertising.",
            ],
        },
        {
            title: "Who we share data with",
            items: [
                "Resend — e-mail delivery provider. E-mails are sent from servers in the European Union (Ireland).",
                "Stripe — online payment operator. Payments take place on Stripe's website under Stripe's privacy policy.",
                "Hosting provider — the entity that runs the application server and database.",
                "Accounting or legal service providers — to the extent necessary for settlements and handling potential claims.",
                "Some providers (e.g. Stripe and Resend) belong to groups based in the USA. Where data is transferred outside the European Economic Area, this is based on a European Commission decision (e.g. the EU-US Data Privacy Framework) or standard contractual clauses approved by the European Commission.",
                "We do not sell your data or share it for marketing purposes.",
            ],
        },
        {
            title: "How long we keep data",
            items: [
                "Account data — until the account is deleted.",
                "Order data and accounting documents — for the period required by law, in particular tax law (generally 5 years from the end of the year in which the tax obligation arose).",
                "Contact form messages — up to 12 months from the last contact, unless the enquiry becomes an order.",
                "Login session data — until you log out or the session expires.",
                "Data processed to pursue or defend claims — until the limitation period for those claims expires.",
            ],
        },
        {
            title: "Your rights",
            items: [
                "You have the right to access, rectify and erase your data, to restrict processing and to data portability.",
                "You have the right to object to processing based on our legitimate interest.",
                `To exercise your rights, write to ${LEGAL_CONTACT_EMAIL}. We will respond without undue delay and no later than within one month.`,
                "You have the right to lodge a complaint with the President of the Personal Data Protection Office (UODO, ul. Stawki 2, 00-193 Warsaw, Poland) if you believe we process your data unlawfully.",
            ],
        },
        {
            title: "Voluntary provision and security",
            items: [
                "Providing data is voluntary but necessary to create an account, place an order or receive a reply to your message. You may skip fields marked as optional.",
                "The connection to the website is encrypted (HTTPS), and passwords are stored only in encrypted form.",
                "Only the client who owns an order and the Controller have access to order data, messages and uploaded images.",
                "We do not make decisions about you based solely on automated processing, including profiling.",
            ],
        },
        {
            title: "Changes to this policy",
            items: [
                "This privacy policy may be updated, e.g. due to changes in law or website features.",
                "The current version is always available on this page together with the date of the last update.",
                "The use of cookies is described in a separate Cookie Policy.",
            ],
        },
    ],
};

// ==========================================
// POLITYKA COOKIES
// ==========================================

const cookiesPl: LegalDocumentContent = {
    metaTitle: "Polityka cookies | AUREONWEB STUDIO",
    metaDescription:
        "Informacje o plikach cookies używanych w serwisie AUREONWEB STUDIO.",
    back: "Powrót na stronę główną",
    eyebrow: "DOKUMENTY PRAWNE",
    title: "Polityka cookies",
    description:
        "Używamy wyłącznie plików cookies niezbędnych do działania serwisu. Nie śledzimy Cię i nie wyświetlamy reklam.",
    updated: `Ostatnia aktualizacja: ${LAST_UPDATED}`,
    contents: "SPIS TREŚCI",
    contactTitle: "Masz pytania?",
    contactDescription:
        "Napisz do nas, jeśli chcesz dowiedzieć się więcej o plikach cookies w naszym serwisie.",
    sections: [
        {
            title: "Czym są pliki cookies",
            items: [
                "Pliki cookies to niewielkie pliki tekstowe zapisywane w Twojej przeglądarce podczas korzystania ze stron internetowych.",
                "Pozwalają one m.in. utrzymać Cię zalogowanym podczas przechodzenia między podstronami.",
                `Administratorem serwisu ${SITE_DOMAIN} jest ${ADMIN_NAME}. Szczegóły dotyczące danych osobowych znajdziesz w Polityce prywatności.`,
            ],
        },
        {
            title: "Jakich plików cookies używamy",
            items: [
                "Cookies sesji logowania — pozwalają rozpoznać, że jesteś zalogowany, i chronią Twoje konto. Bez nich logowanie nie jest możliwe.",
                "Cookie wyboru języka — zapamiętuje wybraną wersję językową serwisu.",
                "Wszystkie powyższe pliki są niezbędne do działania serwisu i świadczenia usługi, o którą prosisz, dlatego nie wymagają Twojej zgody.",
            ],
        },
        {
            title: "Czego nie używamy",
            items: [
                "Nie używamy plików cookies analitycznych (np. Google Analytics).",
                "Nie używamy plików cookies reklamowych ani pikseli śledzących (np. Meta Pixel).",
                "Z tego powodu nie wyświetlamy banera z prośbą o zgodę na cookies. Jeśli w przyszłości dodamy takie narzędzia, poprosimy Cię wcześniej o zgodę.",
            ],
        },
        {
            title: "Płatności Stripe",
            items: [
                "Płatność za zamówienie odbywa się na stronie operatora Stripe (checkout.stripe.com).",
                "Na swojej stronie Stripe może używać własnych plików cookies, m.in. w celu zapobiegania oszustwom, zgodnie z polityką prywatności i cookies Stripe.",
            ],
        },
        {
            title: "Jak zarządzać plikami cookies",
            items: [
                "Możesz usunąć lub zablokować pliki cookies w ustawieniach swojej przeglądarki.",
                "Zablokowanie niezbędnych plików cookies uniemożliwi logowanie i korzystanie z panelu klienta.",
            ],
        },
    ],
};

const cookiesEn: LegalDocumentContent = {
    metaTitle: "Cookie Policy | AUREONWEB STUDIO",
    metaDescription:
        "Information about cookies used on the AUREONWEB STUDIO website.",
    back: "Back to homepage",
    eyebrow: "LEGAL DOCUMENTS",
    title: "Cookie Policy",
    description:
        "We only use cookies that are necessary for the website to work. We do not track you or show ads.",
    updated: `Last updated: ${LAST_UPDATED}`,
    contents: "CONTENTS",
    contactTitle: "Questions?",
    contactDescription:
        "Contact us if you want to know more about cookies on our website.",
    sections: [
        {
            title: "What cookies are",
            items: [
                "Cookies are small text files stored in your browser when you use websites.",
                "Among other things, they keep you logged in as you move between pages.",
                `The ${SITE_DOMAIN} website is operated by ${ADMIN_NAME}. Details about personal data can be found in the Privacy Policy.`,
            ],
        },
        {
            title: "Cookies we use",
            items: [
                "Login session cookies — recognise that you are logged in and protect your account. Logging in is not possible without them.",
                "Language cookie — remembers the selected language version of the website.",
                "All of the above are necessary for the website to work and to provide the service you request, so they do not require your consent.",
            ],
        },
        {
            title: "What we do not use",
            items: [
                "We do not use analytics cookies (e.g. Google Analytics).",
                "We do not use advertising cookies or tracking pixels (e.g. Meta Pixel).",
                "For this reason, we do not display a cookie consent banner. If we add such tools in the future, we will ask for your consent first.",
            ],
        },
        {
            title: "Stripe payments",
            items: [
                "Payment for an order takes place on the Stripe website (checkout.stripe.com).",
                "On its website, Stripe may use its own cookies, e.g. to prevent fraud, in accordance with Stripe's privacy and cookie policy.",
            ],
        },
        {
            title: "Managing cookies",
            items: [
                "You can delete or block cookies in your browser settings.",
                "Blocking necessary cookies will prevent you from logging in and using the client panel.",
            ],
        },
    ],
};

const CONTENT = {
    privacy: { pl: privacyPl, en: privacyEn },
    cookies: { pl: cookiesPl, en: cookiesEn },
} as const;

export function getLegalContent(
    document: keyof typeof CONTENT,
    locale: string
): LegalDocumentContent {
    const lang: Locale = locale === "en" ? "en" : "pl";
    return CONTENT[document][lang];
}
