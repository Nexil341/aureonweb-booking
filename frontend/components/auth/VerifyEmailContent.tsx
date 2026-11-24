"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmailContent({
    initialEmail,
}: {
    initialEmail: string;
}) {
    const router = useRouter();

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");

    // Odliczanie do możliwości ponownego wysłania kodu
    useEffect(() => {
        if (cooldown <= 0) return;

        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    async function handleVerify(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (loading) return;

        setError("");
        setInfo("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Kod musi składać się z 6 cyfr.");
            return;
        }

        setLoading(true);

        try {
            const { error: verifyError } =
                await authClient.emailOtp.verifyEmail({
                    email: email.trim().toLowerCase(),
                    otp,
                });

            if (verifyError) {
                setError(
                    verifyError.status === 429
                        ? "Zbyt wiele prób. Spróbuj ponownie za 15 minut."
                        : "Kod jest nieprawidłowy lub wygasł. Wyślij nowy kod."
                );
                return;
            }

            router.replace("/moje-zamowienia");
            router.refresh();
        } catch {
            setError("Błąd połączenia z serwerem.");
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        if (resending || cooldown > 0) return;

        setError("");
        setInfo("");
        setResending(true);

        try {
            const { error: sendError } =
                await authClient.emailOtp.sendVerificationOtp({
                    email: email.trim().toLowerCase(),
                    type: "email-verification",
                });

            if (sendError) {
                setError(
                    sendError.status === 429
                        ? "Zbyt wiele prób. Spróbuj ponownie za 15 minut."
                        : "Nie udało się wysłać kodu. Spróbuj ponownie."
                );
                return;
            }

            setInfo("Wysłaliśmy nowy kod. Sprawdź skrzynkę, także folder spam.");
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch {
            setError("Błąd połączenia z serwerem.");
        } finally {
            setResending(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#08080d] px-5 py-16 text-white">
            <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-[#11111b] p-7 shadow-2xl sm:p-10">
                <Link
                    href="/logowanie"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Powrót do logowania
                </Link>

                <div className="mt-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <ShieldCheck size={26} />
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight">
                    Potwierdź adres e-mail
                </h1>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Wysłaliśmy 6-cyfrowy kod na Twój adres e-mail.
                    Wpisz go poniżej. Kod jest ważny przez 10 minut.
                </p>

                <form onSubmit={handleVerify} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="verify-email"
                            className="mb-2 block text-sm font-medium text-zinc-200"
                        >
                            Adres e-mail
                        </label>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                            <input
                                id="verify-email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="h-14 w-full rounded-xl border border-white/10 bg-[#08080d] pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 disabled:opacity-60"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="verify-otp"
                            className="mb-2 block text-sm font-medium text-zinc-200"
                        >
                            Kod weryfikacyjny
                        </label>

                        <input
                            id="verify-otp"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            required
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            placeholder="000000"
                            disabled={loading}
                            className="h-14 w-full rounded-xl border border-white/10 bg-[#08080d] px-4 text-center text-2xl font-semibold tracking-[0.5em] outline-none transition focus:border-violet-500 disabled:opacity-60"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {info && (
                        <p role="status" className="text-sm text-emerald-400">
                            {info}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 font-semibold transition hover:bg-violet-500 disabled:opacity-60"
                    >
                        {loading ? "Sprawdzanie..." : "Potwierdź"}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || cooldown > 0 || !email}
                    className="mt-5 w-full text-center text-sm text-zinc-400 transition hover:text-white disabled:opacity-50"
                >
                    {cooldown > 0
                        ? `Wyślij kod ponownie (${cooldown}s)`
                        : resending
                            ? "Wysyłanie..."
                            : "Nie dostałeś kodu? Wyślij ponownie"}
                </button>
            </div>
        </main>
    );
}