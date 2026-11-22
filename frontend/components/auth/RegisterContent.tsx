
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Fingerprint,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    UserRound,
    Zap,
} from "lucide-react";

export default function RegisterContent() {
    const t = useTranslations("RegisterPage");
    const reduceMotion = useReducedMotion();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");

    const nameValid = name.trim().length >= 2;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const passwordValid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password);

    const confirmValid =
        confirmPassword.length > 0 && confirmPassword === password;

    const valid =
        nameValid &&
        emailValid &&
        passwordValid &&
        confirmValid &&
        acceptedTerms;

    const requirements = [
        { label: t("requirements.length"), valid: password.length >= 8 },
        { label: t("requirements.upper"), valid: /[A-Z]/.test(password) },
        { label: t("requirements.lower"), valid: /[a-z]/.test(password) },
        { label: t("requirements.number"), valid: /[0-9]/.test(password) },
    ];

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitted(true);
        setRegisterError("");

        if (!valid || loading) return;

        setLoading(true);

        try {
            const { data, error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            if (error) {
                if (
                    error.status === 409 ||
                    error.code === "USER_ALREADY_EXISTS"
                ) {
                    setRegisterError(
                        "Konto z tym adresem e-mail już istnieje. Spróbuj się zalogować."
                    );
                } else {
                    setRegisterError(
                        error.message || "Nie udało się utworzyć konta."
                    );
                }
                return;
            }

            if (!data) {
                setRegisterError(
                    "Nie otrzymano potwierdzenia rejestracji. Spróbuj ponownie."
                );
                return;
            }

            // Better Auth standardowo tworzy sesję po rejestracji.
            // Jeśli w backendzie wyłączono automatyczne logowanie,
            // użytkownik powinien zalogować się ręcznie.
            if (data.token) {
                router.replace("/moje-zamowienia");
            } else {
                router.replace("/logowanie");
            }

            router.refresh();
        } catch {
            setRegisterError(
                "Nie można połączyć się z serwerem. Sprawdź, czy backend działa."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] text-white">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[130px]" />
                <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[130px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
                {/* LEFT PANEL */}
                <section className="relative hidden w-[48%] flex-col justify-between overflow-hidden border-r border-white/10 bg-[#0c0a17] p-12 lg:flex xl:p-16">
                    <div className="pointer-events-none absolute inset-0">
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(139,92,246,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.08) 1px,transparent 1px)",
                                backgroundSize: "52px 52px",
                                maskImage: "linear-gradient(to bottom,black,transparent)",
                            }}
                        />
                        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[110px]" />
                    </div>

                    <Link
                        href="/"
                        className="relative z-10 inline-flex w-fit items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15">
                            <Sparkles className="h-5 w-5 text-violet-300" />
                        </div>
                        <span className="text-lg font-extrabold tracking-[0.08em]">
                            AUREON<span className="text-violet-400">WEB</span>
                        </span>
                    </Link>

                    <div className="relative z-10 max-w-xl py-20">
                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-violet-300">
                                <Fingerprint className="h-4 w-4" />
                                {t("showcase.badge")}
                            </div>

                            <h1 className="text-5xl font-bold leading-[1.13] tracking-[-0.05em] xl:text-6xl">
                                {t("showcase.title")}
                                <br />
                                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    {t("showcase.highlight")}
                                </span>
                            </h1>

                            <p className="mt-7 max-w-md text-base leading-8 text-zinc-400">
                                {t("showcase.description")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-12 space-y-5"
                        >
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: t("features.security.title"),
                                    description: t("features.security.description"),
                                },
                                {
                                    icon: Zap,
                                    title: t("features.progress.title"),
                                    description: t("features.progress.description"),
                                },
                                {
                                    icon: CheckCircle2,
                                    title: t("features.organization.title"),
                                    description: t("features.organization.description"),
                                },
                            ].map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <div
                                        key={feature.title}
                                        className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 backdrop-blur-sm"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                                            <Icon className="h-5 w-5 text-violet-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-zinc-100">
                                                {feature.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-zinc-500">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>

                    <div className="relative z-10 text-xs text-zinc-600">
                        AUREONWEB STUDIO
                    </div>
                </section>

                {/* RIGHT PANEL */}
                <section className="flex min-h-screen flex-1 flex-col px-6 py-8 sm:px-10 lg:px-14">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t("back")}
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold tracking-wider lg:hidden"
                        >
                            <Sparkles className="h-5 w-5 text-violet-400" />
                            AUREONWEB
                        </Link>
                    </div>

                    <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-16">
                        <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55 }}
                        >
                            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                                <UserRound className="h-6 w-6 text-violet-400" />
                            </div>

                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
                                {t("eyebrow")}
                            </p>

                            <h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                                {t("title")}
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-zinc-400">
                                {t("description")}
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="mt-10 space-y-5"
                            >
                                {/* NAME */}
                                <div>
                                    <label
                                        htmlFor="register-name"
                                        className="mb-2.5 block text-sm font-medium text-zinc-200"
                                    >
                                        {t("name")}
                                    </label>
                                    <div className="relative">
                                        <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-name"
                                            type="text"
                                            autoComplete="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={t("namePlaceholder")}
                                            aria-invalid={submitted && !nameValid}
                                            disabled={loading}
                                            className="h-14 w-full rounded-xl border border-white/10 bg-[#11111b] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-60"
                                        />
                                    </div>
                                    {submitted && !nameValid && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {t("nameError")}
                                        </p>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <label
                                        htmlFor="register-email"
                                        className="mb-2.5 block text-sm font-medium text-zinc-200"
                                    >
                                        {t("email")}
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t("emailPlaceholder")}
                                            aria-invalid={submitted && !emailValid}
                                            disabled={loading}
                                            className="h-14 w-full rounded-xl border border-white/10 bg-[#11111b] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-60"
                                        />
                                    </div>
                                    {submitted && !emailValid && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {t("emailError")}
                                        </p>
                                    )}
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <label
                                        htmlFor="register-password"
                                        className="mb-2.5 block text-sm font-medium text-zinc-200"
                                    >
                                        {t("password")}
                                    </label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t("passwordPlaceholder")}
                                            aria-invalid={submitted && !passwordValid}
                                            disabled={loading}
                                            className="h-14 w-full rounded-xl border border-white/10 bg-[#11111b] pl-12 pr-14 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={
                                                showPassword
                                                    ? t("hidePassword")
                                                    : t("showPassword")
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                                        {requirements.map((item) => (
                                            <div
                                                key={item.label}
                                                className={`flex items-center gap-2 text-xs ${item.valid
                                                        ? "text-emerald-400"
                                                        : "text-zinc-500"
                                                    }`}
                                            >
                                                <Check className="h-3.5 w-3.5 shrink-0" />
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>

                                    {submitted && !passwordValid && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {t("passwordError")}
                                        </p>
                                    )}
                                </div>

                                {/* CONFIRM PASSWORD */}
                                <div>
                                    <label
                                        htmlFor="register-confirm"
                                        className="mb-2.5 block text-sm font-medium text-zinc-200"
                                    >
                                        {t("confirmPassword")}
                                    </label>
                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                                        <input
                                            id="register-confirm"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                            placeholder={t("confirmPlaceholder")}
                                            aria-invalid={submitted && !confirmValid}
                                            disabled={loading}
                                            className="h-14 w-full rounded-xl border border-white/10 bg-[#11111b] pl-12 pr-14 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword((v) => !v)
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? t("hidePassword")
                                                    : t("showPassword")
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {submitted && !confirmValid && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {t("confirmError")}
                                        </p>
                                    )}
                                </div>

                                {/* TERMS */}
                                <div>
                                    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-400">
                                        <input
                                            type="checkbox"
                                            checked={acceptedTerms}
                                            onChange={(e) =>
                                                setAcceptedTerms(e.target.checked)
                                            }
                                            disabled={loading}
                                            className="mt-1 h-4 w-4 shrink-0 accent-violet-600"
                                        />
                                        <span>
                                            {t("termsPrefix")}{" "}
                                            <Link
                                                href="/regulamin"
                                                className="text-violet-400 hover:text-violet-300"
                                            >
                                                {t("terms")}
                                            </Link>{" "}
                                            {t("termsAnd")}{" "}
                                            <Link
                                                href="/polityka-prywatnosci"
                                                className="text-violet-400 hover:text-violet-300"
                                            >
                                                {t("privacy")}
                                            </Link>
                                            .
                                        </span>
                                    </label>

                                    {submitted && !acceptedTerms && (
                                        <p className="mt-2 text-xs text-red-400">
                                            {t("termsError")}
                                        </p>
                                    )}
                                </div>

                                {/* API ERROR */}
                                {registerError && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-300"
                                    >
                                        {registerError}
                                    </div>
                                )}

                                {/* SUBMIT */}
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={
                                        reduceMotion || loading
                                            ? undefined
                                            : { y: -2 }
                                    }
                                    whileTap={
                                        reduceMotion || loading
                                            ? undefined
                                            : { scale: 0.98 }
                                    }
                                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(124,58,237,0.2)] transition hover:from-violet-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Tworzenie konta..." : t("submit")}
                                    {!loading && (
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    )}
                                </motion.button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-xs text-zinc-600">
                                    {t("alreadyHave")}
                                </span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <Link
                                href="/logowanie"
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] text-sm font-semibold text-zinc-200 transition hover:border-violet-500/40 hover:bg-violet-500/5"
                            >
                                {t("login")}
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-zinc-600">
                                <ShieldCheck className="h-4 w-4" />
                                Bezpieczna rejestracja
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </main>
    );
}
