
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Check,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    Clock3,
    Sparkles,
    Loader2,
    AlertCircle,
    Package,
    Hash,
} from "lucide-react";

type Payment = {
    orderId: number;
    package: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    orderStatus: string;
    paidAt: string | null;
};

type ViewState = "loading" | "paid" | "pending" | "error";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentSuccessClient() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [payment, setPayment] = useState<Payment | null>(null);
    const [status, setStatus] = useState<ViewState>("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        let cancelled = false;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let attempts = 0;

        async function checkPayment() {
            try {
                const response = await fetch(
                    `${API_URL}/api/payments/session/${encodeURIComponent(sessionId!)}`,
                    {
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error(
                            "Zaloguj się, aby sprawdzić status swojej płatności."
                        );
                    }

                    throw new Error("Nie udało się pobrać danych zamówienia.");
                }

                const data: Payment = await response.json();

                if (cancelled) return;

                setPayment(data);

                if (data.paymentStatus === "PAID") {
                    setStatus("paid");
                    return;
                }

                setStatus("pending");

                // Webhook Stripe może dotrzeć z niewielkim opóźnieniem.
                if (attempts < 10) {
                    attempts += 1;
                    timeout = setTimeout(checkPayment, 3000);
                }
            } catch (error) {
                if (cancelled) return;

                setStatus("error");
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Wystąpił nieoczekiwany błąd."
                );
            }
        }

        checkPayment();

        return () => {
            cancelled = true;
            if (timeout) clearTimeout(timeout);
        };
    }, [sessionId]);

    const formatPrice = (amount: number) =>
        new Intl.NumberFormat("pl-PL", {
            style: "currency",
            currency: "PLN",
        }).format(amount / 100);

    const isPaid = status === "paid";
    const isLoading = status === "loading";

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080d] px-5 py-20 text-white">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[150px]" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-purple-800/10 blur-[120px]" />

            <div className="relative z-10 w-full max-w-[620px]">
                <div className="mb-12 text-center">
                    <Link
                        href="/pl"
                        className="text-xl font-black tracking-[0.22em]"
                    >
                        AUREON<span className="text-violet-500">WEB</span>
                    </Link>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Studio
                    </p>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-[#111117]/90 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-12">
                    <div className="mb-9 flex justify-center">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
                            {isLoading ? (
                                <Loader2 className="h-11 w-11 animate-spin text-violet-400" />
                            ) : isPaid ? (
                                <Check className="h-11 w-11 text-green-400" strokeWidth={2.5} />
                            ) : status === "error" ? (
                                <AlertCircle className="h-11 w-11 text-red-400" />
                            ) : (
                                <Clock3 className="h-11 w-11 text-amber-400" />
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
                            <Sparkles size={14} />
                            AUREONWEB STUDIO
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {isLoading
                                ? "Sprawdzamy płatność..."
                                : isPaid
                                    ? "Płatność potwierdzona!"
                                    : status === "error"
                                        ? "Nie można sprawdzić płatności"
                                        : "Oczekujemy na potwierdzenie"}
                        </h1>

                        <p className="mx-auto mt-5 max-w-[420px] text-sm leading-7 text-zinc-400">
                            {isLoading
                                ? "Pobieramy aktualne informacje o Twoim zamówieniu."
                                : isPaid
                                    ? "Dziękujemy za zakup! Twoje zamówienie zostało opłacone."
                                    : status === "error"
                                        ? errorMessage
                                        : "Płatność jest jeszcze przetwarzana. Status zostanie automatycznie sprawdzony."}
                        </p>
                    </div>

                    {payment && (
                        <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                            <DetailRow
                                icon={<Hash size={19} />}
                                label="Numer zamówienia"
                                value={`#${payment.orderId}`}
                            />

                            <DetailRow
                                icon={<Package size={19} />}
                                label="Pakiet"
                                value={payment.package}
                            />

                            <DetailRow
                                icon={<CreditCard size={19} />}
                                label="Kwota"
                                value={formatPrice(payment.amount)}
                            />

                            <DetailRow
                                icon={<ShieldCheck size={19} />}
                                label="Status płatności"
                                value={isPaid ? "Opłacono" : payment.paymentStatus}
                                highlight={isPaid}
                                last
                            />
                        </div>
                    )}

                    {!sessionId && (
                        <p className="mt-8 text-center text-sm text-amber-300">
                            Brak identyfikatora sesji płatności. Otwórz tę stronę
                            przez przekierowanie ze Stripe.
                        </p>
                    )}

                    <div className="mt-9 space-y-3">
                        <Link
                            href="/pl/moje-zamowienia"
                            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-violet-600 px-6 py-4 text-sm font-semibold text-white transition-all hover:bg-violet-500"
                        >
                            Przejdź do moich zamówień
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/pl"
                            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.07]"
                        >
                            Wróć na stronę główną
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-zinc-600">
                    © {new Date().getFullYear()} AUREONWEB STUDIO
                </p>
            </div>
        </main>
    );
}

function DetailRow({
    icon,
    label,
    value,
    highlight = false,
    last = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
    last?: boolean;
}) {
    return (
        <div
            className={`flex items-center justify-between gap-4 px-5 py-5 ${last ? "" : "border-b border-white/[0.07]"
                }`}
        >
            <div className="flex items-center gap-3">
                <span className="text-violet-400">{icon}</span>
                <span className="text-sm text-zinc-400">{label}</span>
            </div>

            <span
                className={`text-right text-sm font-semibold ${highlight ? "text-green-400" : "text-white"
                    }`}
            >
                {value}
            </span>
        </div>
    );
}
