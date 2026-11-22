
"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const resetError = searchParams.get("error");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading || !token) return;

        setError("");

        if (password.length < 8) {
            setError("Hasło musi mieć minimum 8 znaków.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Hasła nie są identyczne.");
            return;
        }

        setLoading(true);

        try {
            const { error: resetRequestError } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (resetRequestError) {
                setError("Link jest nieprawidłowy lub wygasł. Poproś o nowy.");
                return;
            }

            setSuccess(true);
            setPassword("");
            setConfirmPassword("");
        } catch {
            setError("Błąd połączenia z serwerem.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#08080d] px-5 py-16 text-white">
            <div className="w-full max-w-[460px] rounded-3xl border border-white/10 bg-[#11111b] p-7 sm:p-10">
                <Link
                    href="/logowanie"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Powrót do logowania
                </Link>

                <div className="mt-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                    <LockKeyhole size={26} />
                </div>

                <h1 className="mt-6 text-3xl font-bold">
                    Ustaw nowe hasło
                </h1>

                {success ? (
                    <div className="mt-8 space-y-5">
                        <CheckCircle2 size={35} className="text-emerald-400" />
                        <p className="text-zinc-300">
                            Hasło zostało zmienione. Możesz zalogować się na konto.
                        </p>
                        <Link
                            href="/logowanie"
                            className="flex h-12 items-center justify-center rounded-xl bg-violet-600 font-semibold hover:bg-violet-500"
                        >
                            Przejdź do logowania
                        </Link>
                    </div>
                ) : !token || resetError ? (
                    <div className="mt-7 space-y-4">
                        <p className="text-sm text-red-400">
                            Link resetujący jest nieprawidłowy lub wygasł.
                        </p>
                        <Link
                            href="/zapomnialem-hasla"
                            className="inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
                        >
                            Poproś o nowy link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="new-password" className="mb-2 block text-sm">
                                Nowe hasło
                            </label>
                            <div className="relative">
                                <input
                                    id="new-password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    disabled={loading}
                                    className="h-14 w-full rounded-xl border border-white/10 bg-[#08080d] px-4 pr-12 outline-none focus:border-violet-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                >
                                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="mb-2 block text-sm">
                                Potwierdź nowe hasło
                            </label>
                            <input
                                id="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="h-14 w-full rounded-xl border border-white/10 bg-[#08080d] px-4 outline-none focus:border-violet-500"
                            />
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-14 w-full rounded-xl bg-violet-600 font-semibold transition hover:bg-violet-500 disabled:opacity-60"
                        >
                            {loading ? "Zapisywanie..." : "Zapisz nowe hasło"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
