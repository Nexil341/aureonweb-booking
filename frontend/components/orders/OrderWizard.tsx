"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "motion/react";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/layout/Navbar";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ClipboardCheck,
    CreditCard,
    FileText,
    Globe2,
    Layers3,
    Loader2,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

type PackageId = "basic" | "standard" | "premium";

// Wartości muszą zgadzać się z backend/validators/orderFields.js
const WEBSITE_TYPES = [
    { id: "landing", label: "Landing page (jedna strona)" },
    { id: "business", label: "Strona firmowa" },
    { id: "shop", label: "Sklep internetowy" },
    { id: "booking", label: "System rezerwacji" },
    { id: "other", label: "Inne" },
] as const;

type WebsiteType = (typeof WEBSITE_TYPES)[number]["id"];

const MATERIALS = [
    { id: "logo", label: "Logo" },
    { id: "photos", label: "Zdjęcia" },
    { id: "texts", label: "Teksty" },
    { id: "need_help", label: "Potrzebuję pomocy z treściami" },
] as const;

type Material = (typeof MATERIALS)[number]["id"];

const PACKAGES: Record<PackageId, number> = {
    basic: 9999,
    standard: 19999,
    premium: 39999,
};

const SEO_PRICE = 9900;
const HOSTING_MONTHLY_PRICE = 5000;

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000"
).replace(/\/$/, "");

const STEP_ICONS = [
    Layers3,
    FileText,
    ClipboardCheck,
];

function formatMoney(grosze: number, locale: string) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "PLN",
    }).format(grosze / 100);
}

export default function OrderWizard() {
    const t = useTranslations("OrderPage");
    const reduceMotion = useReducedMotion();

    const {
        data: session,
        isPending: sessionPending,
    } = authClient.useSession();

    const [step, setStep] = useState(0);

    const [selectedPackage, setSelectedPackage] =
        useState<PackageId>("standard");

    const [hosting, setHosting] = useState(false);
    const [seo, setSeo] = useState(false);

    const [businessName, setBusinessName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [description, setDescription] = useState("");
    const [inspiration, setInspiration] = useState("");

    const [websiteType, setWebsiteType] = useState<WebsiteType | "">("");
    const [phone, setPhone] = useState("");
    const [domain, setDomain] = useState("");
    const [desiredDeadline, setDesiredDeadline] = useState("");
    const [materials, setMaterials] = useState<Material[]>([]);

    const [attempted, setAttempted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [createdOrderId, setCreatedOrderId] =
        useState<number | null>(null);

    const submittingRef = useRef(false);

    const locale = t("currencyLocale");

    const packagePrice = PACKAGES[selectedPackage];
    const seoPrice = seo ? SEO_PRICE : 0;
    const oneTimePrice = packagePrice + seoPrice;

    const monthlyPrice = hosting
        ? HOSTING_MONTHLY_PRICE
        : 0;

    const businessValid =
        businessName.trim().length >= 2 &&
        businessName.trim().length <= 150;

    const emailValid =
        contactEmail.trim().length <= 255 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            contactEmail.trim()
        );

    const descriptionValid =
        description.trim().length >= 20 &&
        description.trim().length <= 5000;

    const inspirationValid = (() => {
        const value = inspiration.trim();

        if (!value) return true;
        if (value.length > 2000) return false;

        try {
            const url = new URL(value);

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );
        } catch {
            return false;
        }
    })();

    // Te same zasady co w backendzie (orderFields.js),
    // żeby klient widział błąd od razu, a nie po wysłaniu.
    const phoneValid = (() => {
        const value = phone.trim();

        if (!value) return true;
        if (!/^\+?[\d\s\-()]{7,25}$/.test(value)) return false;

        const digits = value.replace(/\D/g, "");
        return digits.length >= 9 && digits.length <= 15;
    })();

    const domainValid = (() => {
        const value = domain.trim();

        if (!value) return true;
        return value.length <= 300 && /\.[a-z]{2,}/i.test(value);
    })();

    // Format RRRR-MM-DD pozwala porównywać daty jak tekst
    const today = new Date().toISOString().slice(0, 10);

    // Maksymalnie 2 lata w przód — tak samo jak MAX_DEADLINE_DAYS w backendzie
    const maxDeadline = (() => {
        const date = new Date();
        date.setUTCDate(date.getUTCDate() + 730);
        return date.toISOString().slice(0, 10);
    })();

    const deadlineValid =
        !desiredDeadline ||
        (/^\d{4}-\d{2}-\d{2}$/.test(desiredDeadline) &&
            desiredDeadline >= today &&
            desiredDeadline <= maxDeadline);

    function toggleMaterial(id: Material) {
        setMaterials((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    const projectValid =
        businessValid &&
        emailValid &&
        descriptionValid &&
        inspirationValid &&
        phoneValid &&
        domainValid &&
        deadlineValid;

    const steps = [
        t("steps.package"),
        t("steps.project"),
        t("steps.summary"),
    ];

    const money = (value: number) =>
        formatMoney(value, locale);

    function next() {
        if (isSubmitting || createdOrderId !== null) {
            return;
        }

        if (step === 1) {
            setAttempted(true);

            if (!projectValid) {
                return;
            }
        }

        setSubmitError("");
        setStep((current) => Math.min(2, current + 1));
    }

    function back() {
        if (isSubmitting || createdOrderId !== null) {
            return;
        }

        setSubmitError("");
        setStep((current) => Math.max(0, current - 1));
    }

    // TYLKO przycisk "Zapłać przez Stripe"
    // może wywołać tę funkcję.
    async function handleStripePayment() {
        if (
            step !== 2 ||
            submittingRef.current
        ) {
            return;
        }

        setAttempted(true);

        if (!projectValid) {
            setStep(1);
            return;
        }

        if (sessionPending) {
            setSubmitError(
                "Trwa sprawdzanie sesji. Spróbuj ponownie."
            );
            return;
        }

        if (!session?.user) {
            setSubmitError(
                "Aby zapłacić, musisz zalogować się na konto."
            );
            return;
        }

        submittingRef.current = true;
        setIsSubmitting(true);
        setSubmitError("");

        try {
            let orderId = createdOrderId;

            // 1. Utworzenie zamówienia
            if (orderId === null) {
                const response = await fetch(
                    `${API_URL}/api/orders`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            package: selectedPackage,
                            hosting,
                            seo,
                            business_name: businessName.trim(),
                            contact_email: contactEmail.trim(),
                            description: description.trim(),
                            inspiration: inspiration.trim(),
                            website_type: websiteType || null,
                            phone: phone.trim(),
                            domain: domain.trim(),
                            desired_deadline: desiredDeadline,
                            materials,
                        }),
                    }
                );

                const data = await response
                    .json()
                    .catch(() => null);

                if (!response.ok) {
                    throw new Error(
                        response.status === 401
                            ? "Sesja wygasła. Zaloguj się ponownie."
                            : data?.message ||
                            data?.error ||
                            "Nie udało się utworzyć zamówienia."
                    );
                }

                const newOrderId = data?.order?.id;

                if (
                    !Number.isSafeInteger(newOrderId) ||
                    newOrderId <= 0
                ) {
                    throw new Error(
                        "Serwer nie zwrócił poprawnego numeru zamówienia."
                    );
                }

                orderId = newOrderId;
                setCreatedOrderId(newOrderId);
            }

            // 2. Stripe Checkout
            const checkoutResponse = await fetch(
                `${API_URL}/api/payments/checkout/${orderId}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const checkoutData = await checkoutResponse
                .json()
                .catch(() => null);

            if (!checkoutResponse.ok) {
                throw new Error(
                    checkoutResponse.status === 401
                        ? "Sesja wygasła. Zaloguj się ponownie."
                        : checkoutData?.message ||
                        checkoutData?.error ||
                        "Nie udało się uruchomić płatności."
                );
            }

            const checkoutUrl = checkoutData?.url;

            if (typeof checkoutUrl !== "string") {
                throw new Error(
                    "Serwer nie zwrócił adresu płatności Stripe."
                );
            }

            const destination = new URL(checkoutUrl);

            const validHost =
                destination.hostname === "checkout.stripe.com" ||
                destination.hostname.endsWith(
                    ".checkout.stripe.com"
                );

            if (
                destination.protocol !== "https:" ||
                !validHost
            ) {
                throw new Error(
                    "Nieprawidłowy adres Stripe Checkout."
                );
            }

            // 3. Przekierowanie do Stripe
            window.location.assign(destination.toString());
        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Wystąpił nieoczekiwany błąd."
            );
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    const panelClass =
        "rounded-2xl border border-white/10 bg-[#11111b] p-5 sm:p-6";

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-[#0b0b13] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15";

    return (
        <>
            <Navbar />

            <main className="relative min-h-screen overflow-hidden bg-[#08080d] pb-24 pt-14 text-white">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-violet-700/10 blur-[130px]" />
                    <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
                </div>

                <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
                    {/* HEADER */}
                    <div className="mb-10">
                        <Link
                            href="/oferta"
                            className="mb-7 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            {t("backToOffer")}
                        </Link>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-violet-300">
                            <Sparkles size={14} />
                            {t("eyebrow")}
                        </div>

                        <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                            {t("title")}{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {t("highlight")}
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
                            {t("description")}
                        </p>
                    </div>

                    {/* PROGRESS */}
                    <div className="mb-9 grid grid-cols-3 gap-2 sm:gap-4">
                        {steps.map((label, index) => {
                            const Icon = STEP_ICONS[index];

                            return (
                                <div key={label} className="min-w-0">
                                    <div
                                        className={`mb-3 h-1.5 rounded-full transition-colors ${index <= step
                                            ? "bg-violet-500"
                                            : "bg-white/10"
                                            }`}
                                    />

                                    <div className="flex items-center gap-2">
                                        <Icon
                                            size={16}
                                            className={
                                                index <= step
                                                    ? "text-violet-400"
                                                    : "text-zinc-600"
                                            }
                                        />

                                        <span
                                            className={`hidden text-xs font-medium sm:block ${index === step
                                                ? "text-white"
                                                : "text-zinc-500"
                                                }`}
                                        >
                                            {label}
                                        </span>

                                        <span className="text-xs text-zinc-500 sm:hidden">
                                            {index + 1}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Nie używamy form onSubmit */}
                    <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, x: 18 }
                                    }
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    exit={
                                        reduceMotion
                                            ? undefined
                                            : { opacity: 0, x: -18 }
                                    }
                                    transition={{ duration: 0.22 }}
                                >
                                    {/* STEP 1: PACKAGE */}
                                    {step === 0 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-bold">
                                                    {t("packageTitle")}
                                                </h2>

                                                <p className="mt-2 text-sm text-zinc-400">
                                                    {t("packageDescription")}
                                                </p>
                                            </div>

                                            {(
                                                [
                                                    "basic",
                                                    "standard",
                                                    "premium",
                                                ] as const
                                            ).map((id) => {
                                                const selected =
                                                    selectedPackage === id;

                                                return (
                                                    <button
                                                        key={id}
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedPackage(id)
                                                        }
                                                        aria-pressed={selected}
                                                        className={`w-full rounded-2xl border p-5 text-left transition sm:p-6 ${selected
                                                            ? "border-violet-500 bg-violet-500/10 shadow-[0_0_30px_rgba(124,58,237,0.08)]"
                                                            : "border-white/10 bg-[#11111b] hover:border-violet-500/30"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div>
                                                                <h3 className="text-lg font-bold capitalize">
                                                                    {id}
                                                                </h3>

                                                                <p className="mt-1 text-sm text-zinc-400">
                                                                    {t(
                                                                        `packages.${id}`
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="text-right">
                                                                <p className="text-lg font-bold">
                                                                    {money(
                                                                        PACKAGES[id]
                                                                    )}
                                                                </p>

                                                                <div
                                                                    className={`ml-auto mt-2 flex h-6 w-6 items-center justify-center rounded-full border ${selected
                                                                        ? "border-violet-400 bg-violet-600"
                                                                        : "border-white/20"
                                                                        }`}
                                                                >
                                                                    {selected && (
                                                                        <Check size={14} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}

                                            {/* EXTRAS */}
                                            <div className={panelClass}>
                                                <h3 className="mb-4 font-semibold">
                                                    {t("extras")}
                                                </h3>

                                                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 p-4">
                                                    <span>
                                                        <span className="block text-sm font-semibold">
                                                            {t("hosting")}
                                                        </span>

                                                        <span className="mt-1 block text-xs text-zinc-500">
                                                            {t(
                                                                "hostingDescription"
                                                            )}
                                                        </span>

                                                        <span className="mt-2 block text-xs font-semibold text-violet-300">
                                                            +{money(
                                                                HOSTING_MONTHLY_PRICE
                                                            )}/mies.
                                                        </span>
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        checked={hosting}
                                                        onChange={(e) =>
                                                            setHosting(
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="h-5 w-5 accent-violet-600"
                                                    />
                                                </label>

                                                <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 p-4">
                                                    <span>
                                                        <span className="block text-sm font-semibold">
                                                            {t("seo")}
                                                        </span>

                                                        <span className="mt-1 block text-xs text-zinc-500">
                                                            {t(
                                                                "seoDescription"
                                                            )}
                                                        </span>

                                                        <span className="mt-2 block text-xs font-semibold text-violet-300">
                                                            +{money(SEO_PRICE)}
                                                        </span>
                                                    </span>

                                                    <input
                                                        type="checkbox"
                                                        checked={seo}
                                                        onChange={(e) =>
                                                            setSeo(
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="h-5 w-5 accent-violet-600"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: PROJECT */}
                                    {step === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-bold">
                                                    {t("projectTitle")}
                                                </h2>

                                                <p className="mt-2 text-sm text-zinc-400">
                                                    {t(
                                                        "projectDescription"
                                                    )}
                                                </p>
                                            </div>

                                            <div
                                                className={
                                                    panelClass + " space-y-5"
                                                }
                                            >
                                                <div>
                                                    <label
                                                        htmlFor="businessName"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        {t("businessName")}
                                                    </label>

                                                    <input
                                                        id="businessName"
                                                        value={businessName}
                                                        onChange={(e) =>
                                                            setBusinessName(
                                                                e.target.value
                                                            )
                                                        }
                                                        maxLength={150}
                                                        placeholder={t(
                                                            "businessPlaceholder"
                                                        )}
                                                        className={inputClass}
                                                        aria-invalid={
                                                            attempted &&
                                                            !businessValid
                                                        }
                                                    />

                                                    {attempted &&
                                                        !businessValid && (
                                                            <p className="mt-2 text-xs text-red-400">
                                                                {t(
                                                                    "businessError"
                                                                )}
                                                            </p>
                                                        )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="contactEmail"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        {t("contactEmail")}
                                                    </label>

                                                    <input
                                                        id="contactEmail"
                                                        type="email"
                                                        value={contactEmail}
                                                        onChange={(e) =>
                                                            setContactEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                        maxLength={255}
                                                        placeholder="kontakt@firma.pl"
                                                        className={inputClass}
                                                        aria-invalid={
                                                            attempted &&
                                                            !emailValid
                                                        }
                                                    />

                                                    {attempted &&
                                                        !emailValid && (
                                                            <p className="mt-2 text-xs text-red-400">
                                                                {t(
                                                                    "emailError"
                                                                )}
                                                            </p>
                                                        )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="description"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        {t("projectDetails")}
                                                    </label>

                                                    <textarea
                                                        id="description"
                                                        rows={6}
                                                        value={description}
                                                        onChange={(e) =>
                                                            setDescription(
                                                                e.target.value
                                                            )
                                                        }
                                                        maxLength={5000}
                                                        placeholder={t(
                                                            "detailsPlaceholder"
                                                        )}
                                                        className={
                                                            inputClass +
                                                            " resize-y"
                                                        }
                                                        aria-invalid={
                                                            attempted &&
                                                            !descriptionValid
                                                        }
                                                    />

                                                    {attempted &&
                                                        !descriptionValid && (
                                                            <p className="mt-2 text-xs text-red-400">
                                                                {t(
                                                                    "detailsError"
                                                                )}
                                                            </p>
                                                        )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="inspiration"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        {t("inspiration")}
                                                    </label>

                                                    <input
                                                        id="inspiration"
                                                        type="url"
                                                        value={inspiration}
                                                        onChange={(e) =>
                                                            setInspiration(
                                                                e.target.value
                                                            )
                                                        }
                                                        maxLength={2000}
                                                        placeholder="https://..."
                                                        className={inputClass}
                                                        aria-invalid={
                                                            attempted &&
                                                            !inspirationValid
                                                        }
                                                    />

                                                    {attempted &&
                                                        !inspirationValid && (
                                                            <p className="mt-2 text-xs text-red-400">
                                                                Podaj poprawny link HTTP lub HTTPS.
                                                            </p>
                                                        )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="websiteType"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        Rodzaj strony{" "}
                                                        <span className="text-zinc-500">(opcjonalnie)</span>
                                                    </label>

                                                    <select
                                                        id="websiteType"
                                                        value={websiteType}
                                                        onChange={(e) =>
                                                            setWebsiteType(
                                                                e.target.value as WebsiteType | ""
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">Wybierz...</option>
                                                        {WEBSITE_TYPES.map((type) => (
                                                            <option key={type.id} value={type.id}>
                                                                {type.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="grid gap-5 sm:grid-cols-2">
                                                    <div>
                                                        <label
                                                            htmlFor="phone"
                                                            className="mb-2 block text-sm font-medium"
                                                        >
                                                            Telefon{" "}
                                                            <span className="text-zinc-500">(opcjonalnie)</span>
                                                        </label>

                                                        <input
                                                            id="phone"
                                                            type="tel"
                                                            autoComplete="tel"
                                                            value={phone}
                                                            onChange={(e) => setPhone(e.target.value)}
                                                            maxLength={25}
                                                            placeholder="+48 600 100 200"
                                                            className={inputClass}
                                                            aria-invalid={attempted && !phoneValid}
                                                        />

                                                        {attempted && !phoneValid && (
                                                            <p className="mt-2 text-xs text-red-400">
                                                                Podaj poprawny numer telefonu.
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="desiredDeadline"
                                                            className="mb-2 block text-sm font-medium"
                                                        >
                                                            Preferowany termin{" "}
                                                            <span className="text-zinc-500">(opcjonalnie)</span>
                                                        </label>

                                                        <input
                                                            id="desiredDeadline"
                                                            type="date"
                                                            min={today}
                                                            max={maxDeadline}
                                                            value={desiredDeadline}
                                                            onChange={(e) => setDesiredDeadline(e.target.value)}
                                                            className={inputClass + " [color-scheme:dark]"}
                                                            aria-invalid={attempted && !deadlineValid}
                                                        />

                                                        {attempted && !deadlineValid && (
                                                            <p className="mt-2 text-xs text-red-400">
                                                                Wybierz termin od dziś do 2 lat w przód.                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="domain"
                                                        className="mb-2 block text-sm font-medium"
                                                    >
                                                        Twoja domena{" "}
                                                        <span className="text-zinc-500">(jeśli masz)</span>
                                                    </label>

                                                    <input
                                                        id="domain"
                                                        value={domain}
                                                        onChange={(e) => setDomain(e.target.value)}
                                                        maxLength={300}
                                                        placeholder="twojafirma.pl"
                                                        className={inputClass}
                                                        aria-invalid={attempted && !domainValid}
                                                    />

                                                    {attempted && !domainValid && (
                                                        <p className="mt-2 text-xs text-red-400">
                                                            Podaj poprawną domenę, np. twojafirma.pl.
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="mb-3 text-sm font-medium">
                                                        Co już masz?{" "}
                                                        <span className="text-zinc-500">(opcjonalnie)</span>
                                                    </p>

                                                    <div className="grid gap-3 sm:grid-cols-2">
                                                        {MATERIALS.map((item) => {
                                                            const checked = materials.includes(item.id);

                                                            return (
                                                                <label
                                                                    key={item.id}
                                                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${checked
                                                                        ? "border-violet-500/50 bg-violet-500/10 text-white"
                                                                        : "border-white/10 text-zinc-300 hover:border-white/20"
                                                                        }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={() => toggleMaterial(item.id)}
                                                                        className="h-4 w-4 accent-violet-500"
                                                                    />
                                                                    {item.label}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: SUMMARY */}
                                    {step === 2 && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-bold">
                                                    Podsumowanie zamówienia
                                                </h2>

                                                <p className="mt-2 text-sm text-zinc-400">
                                                    Sprawdź wszystkie
                                                    szczegóły przed
                                                    przejściem do płatności.
                                                </p>
                                            </div>

                                            {/* PACKAGE CARD */}
                                            <div className="rounded-2xl border border-violet-500/30 bg-[#14101f] p-5 sm:p-6">
                                                <div className="mb-4 flex items-center gap-2">
                                                    <Layers3
                                                        size={18}
                                                        className="text-violet-400"
                                                    />

                                                    <h3 className="font-bold">
                                                        Wybrany pakiet
                                                    </h3>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-xl font-bold capitalize">
                                                            {selectedPackage}
                                                        </p>

                                                        <p className="mt-1 text-sm text-zinc-400">
                                                            {t(
                                                                `packages.${selectedPackage}`
                                                            )}
                                                        </p>
                                                    </div>

                                                    <p className="text-2xl font-bold text-violet-300">
                                                        {money(packagePrice)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* EXTRAS CARD */}
                                            <div className={panelClass}>
                                                <h3 className="mb-5 font-bold">
                                                    Dodatkowe usługi
                                                </h3>

                                                <div className="space-y-4">
                                                    <SummaryRow
                                                        label="Optymalizacja SEO"
                                                        value={
                                                            seo
                                                                ? `+${money(
                                                                    SEO_PRICE
                                                                )}`
                                                                : "Nie wybrano"
                                                        }
                                                    />

                                                    <SummaryRow
                                                        label="Hosting"
                                                        value={
                                                            hosting
                                                                ? `${money(
                                                                    HOSTING_MONTHLY_PRICE
                                                                )}/mies.`
                                                                : "Nie wybrano"
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* PROJECT CARD */}
                                            <div className={panelClass}>
                                                <div className="mb-5 flex items-center gap-2">
                                                    <FileText
                                                        size={18}
                                                        className="text-violet-400"
                                                    />

                                                    <h3 className="font-bold">
                                                        Dane projektu
                                                    </h3>
                                                </div>

                                                <div className="space-y-5">
                                                    <div>
                                                        <p className="mb-1 text-xs text-zinc-500">
                                                            Nazwa firmy
                                                        </p>

                                                        <p className="break-words font-semibold">
                                                            {businessName}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-1 text-xs text-zinc-500">
                                                            E-mail kontaktowy
                                                        </p>

                                                        <p className="break-all text-sm text-zinc-300">
                                                            {contactEmail}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs text-zinc-500">
                                                            Opis projektu
                                                        </p>

                                                        <div className="rounded-xl border border-white/5 bg-[#0b0b13] p-4">
                                                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-zinc-300">
                                                                {description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {inspiration.trim() && (
                                                        <div>
                                                            <p className="mb-1 text-xs text-zinc-500">
                                                                Inspiracja
                                                            </p>

                                                            <p className="break-all text-sm text-violet-300">
                                                                {inspiration}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {(websiteType || phone.trim() || domain.trim() || desiredDeadline || materials.length > 0) && (
                                                        <div className="grid gap-4 rounded-xl border border-white/5 bg-[#0b0b13] p-4 text-sm sm:grid-cols-2">
                                                            {websiteType && (
                                                                <div>
                                                                    <p className="mb-1 text-xs text-zinc-500">Rodzaj strony</p>
                                                                    <p className="text-zinc-300">
                                                                        {WEBSITE_TYPES.find((type) => type.id === websiteType)?.label}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {phone.trim() && (
                                                                <div>
                                                                    <p className="mb-1 text-xs text-zinc-500">Telefon</p>
                                                                    <p className="text-zinc-300">{phone}</p>
                                                                </div>
                                                            )}

                                                            {domain.trim() && (
                                                                <div>
                                                                    <p className="mb-1 text-xs text-zinc-500">Domena</p>
                                                                    <p className="break-all text-zinc-300">{domain}</p>
                                                                </div>
                                                            )}

                                                            {desiredDeadline && (
                                                                <div>
                                                                    <p className="mb-1 text-xs text-zinc-500">Preferowany termin</p>
                                                                    <p className="text-zinc-300">
                                                                        {new Date(desiredDeadline).toLocaleDateString("pl-PL")}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {materials.length > 0 && (
                                                                <div className="sm:col-span-2">
                                                                    <p className="mb-1 text-xs text-zinc-500">Materiały</p>
                                                                    <p className="text-zinc-300">
                                                                        {MATERIALS.filter((item) => materials.includes(item.id))
                                                                            .map((item) => item.label)
                                                                            .join(", ")}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* PAYMENT CARD */}
                                            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-[#11101b] p-5 sm:p-6">
                                                <div className="mb-5 flex items-center gap-2">
                                                    <CreditCard
                                                        size={19}
                                                        className="text-violet-400"
                                                    />

                                                    <h3 className="font-bold">
                                                        Podsumowanie płatności
                                                    </h3>
                                                </div>

                                                <div className="space-y-4">
                                                    <SummaryRow
                                                        label={`Pakiet ${selectedPackage.toUpperCase()}`}
                                                        value={money(
                                                            packagePrice
                                                        )}
                                                    />

                                                    {seo && (
                                                        <SummaryRow
                                                            label="SEO"
                                                            value={money(
                                                                SEO_PRICE
                                                            )}
                                                        />
                                                    )}

                                                    <div className="border-t border-white/10 pt-5">
                                                        <div className="flex flex-wrap items-end justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm text-zinc-400">
                                                                    Do zapłaty teraz
                                                                </p>

                                                                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                                                    {money(
                                                                        oneTimePrice
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <ShieldCheck
                                                                size={28}
                                                                className="text-violet-400"
                                                            />
                                                        </div>
                                                    </div>

                                                    {hosting && (
                                                        <div className="border-t border-white/10 pt-4">
                                                            <SummaryRow
                                                                label="Hosting — osobne rozliczenie"
                                                                value={`${money(
                                                                    monthlyPrice
                                                                )}/mies.`}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* PAYMENT NOTICE */}
                                            <div className="flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm leading-6 text-violet-200">
                                                <ShieldCheck
                                                    size={20}
                                                    className="mt-0.5 shrink-0"
                                                />

                                                <p>
                                                    Po kliknięciu przycisku
                                                    „Zapłać przez Stripe”
                                                    zostaniesz przekierowany
                                                    do bezpiecznej płatności.
                                                    {hosting &&
                                                        " Hosting miesięczny zostanie rozliczony osobno — automatyczna subskrypcja nie jest jeszcze aktywna."}
                                                </p>
                                            </div>

                                            {!sessionPending &&
                                                !session?.user && (
                                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                                                        Zaloguj się, aby
                                                        zapłacić za zamówienie.
                                                    </div>
                                                )}

                                            {submitError && (
                                                <div
                                                    role="alert"
                                                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                                                >
                                                    <p>{submitError}</p>

                                                    {createdOrderId !==
                                                        null && (
                                                            <p className="mt-2 text-xs">
                                                                Zamówienie #
                                                                {createdOrderId}{" "}
                                                                zostało zapisane.
                                                                Możesz ponowić
                                                                płatność.
                                                            </p>
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* NAVIGATION */}
                            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={back}
                                    disabled={
                                        step === 0 ||
                                        isSubmitting ||
                                        createdOrderId !== null
                                    }
                                    className="flex h-12 items-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-semibold text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    <ArrowLeft size={16} />
                                    {t("previous")}
                                </button>

                                {step < 2 ? (
                                    <button
                                        type="button"
                                        onClick={next}
                                        className="flex h-12 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-bold text-white transition hover:bg-violet-500"
                                    >
                                        {t("next")}
                                        <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleStripePayment}
                                        disabled={
                                            isSubmitting ||
                                            sessionPending
                                        }
                                        className="flex h-12 items-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />
                                                Przekierowywanie...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={17} />
                                                {createdOrderId !== null
                                                    ? "Ponów płatność"
                                                    : "Zapłać przez Stripe"}
                                                <ArrowRight size={16} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {step === 2 && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                                    <LockKeyhole size={13} />
                                    Bezpieczne przekierowanie do Stripe Checkout
                                </div>
                            )}
                        </div>

                        {/* LIVE SUMMARY */}
                        <aside className="lg:sticky lg:top-28 lg:self-start">
                            <div className="rounded-2xl border border-violet-500/20 bg-[#11101b] p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <Globe2
                                        size={18}
                                        className="text-violet-400"
                                    />

                                    <h3 className="font-bold">
                                        {t("yourOrder")}
                                    </h3>
                                </div>

                                <div className="space-y-4 text-sm">
                                    <SummaryRow
                                        label={t("selectedPackage")}
                                        value={selectedPackage.toUpperCase()}
                                    />

                                    {seo && (
                                        <SummaryRow
                                            label={t("seo")}
                                            value={money(seoPrice)}
                                        />
                                    )}

                                    <div className="border-t border-white/10 pt-5">
                                        <p className="text-xs text-zinc-500">
                                            {t("oneTime")}
                                        </p>

                                        <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                                            {money(oneTimePrice)}
                                        </p>
                                    </div>

                                    {hosting && (
                                        <div className="border-t border-white/10 pt-4">
                                            <p className="text-xs text-zinc-500">
                                                {t("monthly")}
                                            </p>

                                            <p className="mt-1 text-xl font-bold text-violet-300">
                                                {money(monthlyPrice)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-6 text-zinc-500">
                                    <Check
                                        size={16}
                                        className="mt-1 shrink-0 text-violet-400"
                                    />

                                    {t("priceNote")}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

function SummaryRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-zinc-500">
                {label}
            </span>

            <span className="max-w-[60%] break-words text-right font-semibold text-zinc-200">
                {value}
            </span>
        </div>
    );
}
