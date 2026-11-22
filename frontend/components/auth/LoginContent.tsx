
"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    Fingerprint,
    CheckCircle2,
    Zap,
} from "lucide-react";

export default function LoginContent() {
    const t = useTranslations("LoginPage");
    const router = useRouter();
    const reduceMotion = useReducedMotion();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;

        setError("");

        if (!email.trim() || !password) {
            setError("Wpisz adres e-mail i hasło.");
            return;
        }

        setLoading(true);

        try {
            const result = await authClient.signIn.email({
                email: email.trim().toLowerCase(),
                password,
            });

            if (result.error) {
                setError(
                    result.error.status === 401 ||
                        result.error.code === "INVALID_EMAIL_OR_PASSWORD"
                        ? "Nieprawidłowy adres e-mail lub hasło."
                        : result.error.message || "Nie udało się zalogować."
                );
                return;
            }

            if (!result.data) {
                setError("Nie udało się potwierdzić logowania.");
                return;
            }

            router.replace("/moje-zamowienia");
            router.refresh();
        } catch {
            setError(
                "Wystąpił błąd połączenia. Sprawdź backend i konfigurację CORS."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] text-white">
            {/* BACKGROUND */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-violet-700/10 blur-[130px]" />
                <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[130px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
                {/* LEFT PANEL */}
                <section className="relative hidden w-[48%] flex-col justify-between overflow-hidden border-r border-white/10 bg-[#0c0a17] p-12 lg:flex xl:p-16">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(139,92,246,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.08) 1px,transparent 1px)",
                            backgroundSize: "52px 52px",
                            maskImage: "linear-gradient(to bottom,black,transparent)",
                        }}
                    />

                    <Link
                        href="/"
                        className="relative z-10 inline-flex w-fit items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/15">
                            <Sparkles className="h-5 w-5 text-violet-300" />
                        </div>
                        <span className="text-lg font-extrabold tracking-wider">
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
                                AUREONWEB ACCOUNT
                            </div>

                            <h1 className="text-5xl font-bold leading-[1.13] tracking-[-0.05em] xl:text-6xl">
                                Twoje projekty.
                                <br />
                                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    Jedno miejsce.
                                </span>
                            </h1>

                            <p className="mt-7 max-w-md text-base leading-8 text-zinc-400">
                                Zaloguj się do panelu klienta AUREONWEB STUDIO.
                                Sprawdzaj postępy realizacji, zarządzaj zamówieniami
                                i miej wszystko pod kontrolą.
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
                                    title: "Bezpieczne logowanie",
                                    description:
                                        "Twoje konto i sesja są obsługiwane przez Better Auth.",
                                },
                                {
                                    icon: Zap,
                                    title: "Postępy projektów",
                                    description:
                                        "W przyszłości sprawdzisz aktualny etap realizacji swojej strony.",
                                },
                                {
                                    icon: CheckCircle2,
                                    title: "Wszystko w jednym miejscu",
                                    description:
                                        "Zamówienia, informacje i kontakt z AUREONWEB.",
                                },
                            ].map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 backdrop-blur-sm"
                                    >
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                                            <Icon className="h-5 w-5 text-violet-400" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-zinc-100">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-zinc-500">
                                                {item.description}
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
                            Powrót
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
                                <LockKeyhole className="h-6 w-6 text-violet-400" />
                            </div>

                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">
                                PANEL KLIENTA
                            </p>

                            <h2 className="text-4xl font-bold tracking-[-0.045em] sm:text-5xl">
                                Zaloguj się
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-zinc-400">
                                Wprowadź dane swojego konta, aby przejść do panelu.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="mt-10 space-y-5"
                            >
                                {/* EMAIL */}
                                <div>
                                    <label
                                        htmlFor="login-email"
                                        className="mb-2.5 block text-sm font-medium text-zinc-200"
                                    >
                                        Adres e-mail
                                    </label>

                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                                        <input
                                            id="login-email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            placeholder="twoj@email.pl"
                                            required
                                            className="h-14 w-full rounded-xl border border-white/10 bg-[#11111b] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div>
                                    <div className="mb-2.5 flex items-center justify-between">
                                        <label
                                            htmlFor="login-password"
                                            className="text-sm font-medium text-zinc-200"
                                        >
                                            Hasło
                                        </label>
                                        <Link
                                            href="/zapomnialem-hasla"
                                            className="text-xs font-semibold text-violet-400 transition hover:text-violet-300"
                                        >
                                            Nie pamiętasz hasła?
                                        </Link>
                                    </div>



                                    <div className="relative">
                                        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                                        <input
                                            id="login-password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            placeholder="Wpisz swoje hasło"
                                            required
                                            className="h-14 w-full rounded-xl border border-white/10 bg-[#11111b] pl-12 pr-14 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 disabled:opacity-60"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={
                                                showPassword ? "Ukryj hasło" : "Pokaż hasło"
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
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-300"
                                    >
                                        {error}
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
                                    {loading ? "Logowanie..." : "Zaloguj się"}

                                    {!loading && (
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    )}
                                </motion.button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="text-xs text-zinc-600">
                                    Nie masz jeszcze konta?
                                </span>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <Link
                                href="/rejestracja"
                                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] text-sm font-semibold text-zinc-200 transition hover:border-violet-500/40 hover:bg-violet-500/5"
                            >
                                Utwórz konto
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-zinc-600">
                                <ShieldCheck className="h-4 w-4" />
                                Bezpieczne logowanie
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </main>
    );
}
