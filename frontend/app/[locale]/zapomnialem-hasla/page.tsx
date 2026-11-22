
"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (loading) return;

        setError("");
        setLoading(true);

        try {
            const { error: requestError } = await authClient.requestPasswordReset({
                email: email.trim().toLowerCase(),
                redirectTo: `${window.location.origin}/pl/reset-hasla`,
            });

            if (requestError) {
                setError("Nie udało się wysłać żądania. Spróbuj ponownie.");
                return;
            }

            setSent(true);
        } catch {
            setError("Błąd połączenia z serwerem.");
        } finally {
            setLoading(false);
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
                    <Mail size={26} />
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight">
                    Zapomniałeś hasła?
                </h1>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Wpisz adres e-mail przypisany do konta AUREONWEB.
                    Jeśli konto istnieje, otrzymasz instrukcję zmiany hasła.
                </p>

                {sent ? (
                    <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                        <ShieldCheck className="mb-3 text-emerald-400" />
                        <p className="font-semibold text-white">
                            Sprawdź swoją pocztę
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                            Jeśli podany adres jest zarejestrowany,
                            instrukcja resetowania hasła została przygotowana.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label
                                htmlFor="reset-email"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Adres e-mail
                            </label>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

                                <input
                                    id="reset-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="twoj@email.pl"
                                    disabled={loading}
                                    className="h-14 w-full rounded-xl border border-white/10 bg-[#08080d] pl-12 pr-4 text-sm outline-none transition focus:border-violet-500 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {error && (
                            <p role="alert" className="text-sm text-red-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 font-semibold transition hover:bg-violet-500 disabled:opacity-60"
                        >
                            {loading ? "Przetwarzanie..." : "Resetuj hasło"}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
