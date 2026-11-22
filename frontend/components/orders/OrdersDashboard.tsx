
"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FolderKanban,
    Loader2,
    MessageCircle,
    Package,
    Plus,
    RefreshCw,
} from "lucide-react";

import OrderChat from "./OrderChat";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiOrder = {
    id: number;
    package: string;
    business_name: string | null;
    description: string | null;
    hosting: boolean;
    price: number;
    payment_status: string;
    order_status: string;
    progress: number;
    stage: number;
    deadline: string | null;
    created_at: string | null;
};

const statusLabels: Record<string, string> = {
    NEW: "Nowe",
    PENDING: "Oczekujące",
    ACCEPTED: "Zaakceptowane",
    IN_PROGRESS: "W realizacji",
    COMPLETED: "Ukończone",
    CANCELLED: "Anulowane",
};

function formatPrice(grosze: number) {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(grosze / 100);
}

function formatDate(date: string | null) {
    if (!date) return "Do ustalenia";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Nieznana data";
    }

    return new Intl.DateTimeFormat("pl-PL", {
        dateStyle: "long",
    }).format(parsed);
}

export default function OrdersDashboard() {
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    // Aktualnie otwarta rozmowa
    const [chatOrder, setChatOrder] = useState<ApiOrder | null>(null);

    async function loadOrders() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/api/orders/my`, {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            });

            if (response.status === 401) {
                throw new Error(
                    "Zaloguj się, aby zobaczyć swoje zamówienia."
                );
            }

            if (!response.ok) {
                throw new Error("Nie udało się pobrać zamówień.");
            }

            const data = await response.json();

            if (!Array.isArray(data.orders)) {
                throw new Error("Niepoprawna odpowiedź serwera.");
            }

            setOrders(data.orders);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Wystąpił nieoczekiwany błąd."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesFilter =
                filter === "ALL" || order.order_status === filter;

            const query = search.trim().toLowerCase();

            const matchesSearch =
                String(order.id).includes(query) ||
                (order.business_name || "")
                    .toLowerCase()
                    .includes(query) ||
                order.package.toLowerCase().includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [orders, filter, search]);

    const activeCount = orders.filter(
        (order) =>
            order.order_status === "IN_PROGRESS" ||
            order.order_status === "ACCEPTED"
    ).length;

    const completedCount = orders.filter(
        (order) => order.order_status === "COMPLETED"
    ).length;

    return (
        <main className="min-h-screen bg-[#08080d] px-5 py-16 text-white">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                            AUREONWEB / PANEL KLIENTA
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                            Moje zamówienia
                            <span className="text-violet-500">.</span>
                        </h1>

                        <p className="mt-4 text-zinc-400">
                            Śledź realizację swoich projektów, sprawdzaj
                            postępy i kontaktuj się z administratorem.
                        </p>
                    </div>

                    <Link
                        href="/zamowienie"
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold transition hover:bg-violet-500"
                    >
                        <Plus size={18} />
                        Nowe zamówienie
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* STATYSTYKI */}
                <div className="mb-10 grid gap-4 md:grid-cols-3">
                    {[
                        {
                            label: "Wszystkie zamówienia",
                            value: orders.length,
                            icon: Package,
                        },
                        {
                            label: "Aktywne projekty",
                            value: activeCount,
                            icon: Clock3,
                        },
                        {
                            label: "Ukończone projekty",
                            value: completedCount,
                            icon: CheckCircle2,
                        },
                    ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-[#11111b] p-6"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                    <Icon size={22} />
                                </div>

                                <p className="text-3xl font-bold">
                                    {stat.value}
                                </p>

                                <p className="mt-2 text-sm text-zinc-400">
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* LISTA ZAMÓWIEŃ */}
                <section className="rounded-2xl border border-white/10 bg-[#101018] p-5 md:p-8">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <FolderKanban className="text-violet-400" />

                            <h2 className="text-xl font-bold">
                                Twoje projekty
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadOrders()}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Odśwież
                        </button>
                    </div>

                    {/* WYSZUKIWARKA */}
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Szukaj zamówienia..."
                        className="mb-5 w-full rounded-xl border border-white/10 bg-[#08080d] px-4 py-3 outline-none transition focus:border-violet-500"
                    />

                    {/* FILTRY */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        {[
                            ["ALL", "Wszystkie"],
                            ["NEW", "Nowe"],
                            ["ACCEPTED", "Zaakceptowane"],
                            ["IN_PROGRESS", "W realizacji"],
                            ["COMPLETED", "Ukończone"],
                        ].map(([value, label]) => (
                            <button
                                type="button"
                                key={value}
                                onClick={() => setFilter(value)}
                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${filter === value
                                    ? "border-violet-500 bg-violet-500/15 text-violet-300"
                                    : "border-white/10 text-zinc-400 hover:text-white"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ŁADOWANIE */}
                    {loading && (
                        <div className="flex justify-center py-16">
                            <Loader2 className="animate-spin text-violet-400" />
                        </div>
                    )}

                    {/* BŁĄD */}
                    {error && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
                            {error}
                        </div>
                    )}

                    {/* BRAK ZAMÓWIEŃ */}
                    {!loading &&
                        !error &&
                        filteredOrders.length === 0 && (
                            <div className="py-16 text-center text-zinc-400">
                                Nie znaleziono zamówień.
                            </div>
                        )}

                    {/* KARTY ZAMÓWIEŃ */}
                    <div className="space-y-5">
                        {!loading &&
                            !error &&
                            filteredOrders.map((order) => (
                                <article
                                    key={order.id}
                                    className="rounded-2xl border border-white/10 bg-[#15151f] p-6 transition hover:border-violet-500/30"
                                >
                                    {/* INFORMACJE PODSTAWOWE */}
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div>
                                            <p className="mb-2 text-xs font-bold text-violet-400">
                                                TWÓJ PROJEKT
                                            </p>

                                            <h3 className="text-xl font-bold">
                                                {order.business_name ||
                                                    `Strona internetowa — ${order.package}`}
                                            </h3>

                                            <p className="mt-2 text-sm text-zinc-400">
                                                Pakiet {order.package}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <span className="inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300">
                                                {statusLabels[order.order_status] ||
                                                    order.order_status}
                                            </span>

                                            <p className="mt-4 text-lg font-bold">
                                                {formatPrice(order.price)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* SZCZEGÓŁY */}
                                    <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Data zamówienia
                                            </p>

                                            <p className="mt-2 flex items-center gap-2 text-sm">
                                                <CalendarDays
                                                    size={16}
                                                    className="text-violet-400"
                                                />
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Termin realizacji
                                            </p>

                                            <p className="mt-2 text-sm">
                                                {formatDate(order.deadline)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Status płatności
                                            </p>

                                            <p
                                                className={`mt-2 text-sm font-semibold ${order.payment_status === "PAID"
                                                    ? "text-emerald-400"
                                                    : "text-amber-400"
                                                    }`}
                                            >
                                                {order.payment_status === "PAID"
                                                    ? "Opłacone"
                                                    : order.payment_status === "PENDING"
                                                        ? "Oczekuje na płatność"
                                                        : order.payment_status}
                                            </p>
                                        </div>
                                    </div>

                                    {/* POSTĘP REALIZACJI */}
                                    <div className="mt-8">
                                        <div className="mb-3 flex justify-between text-sm">
                                            <span className="text-zinc-400">
                                                Postęp realizacji
                                            </span>

                                            <span className="font-bold text-violet-300">
                                                {Math.max(
                                                    0,
                                                    Math.min(100, order.progress ?? 0)
                                                )}
                                                %
                                            </span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all"
                                                style={{
                                                    width: `${Math.max(
                                                        0,
                                                        Math.min(100, order.progress ?? 0)
                                                    )}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="mt-3 text-xs text-zinc-500">
                                            Etap {order.stage} z 5
                                        </p>
                                    </div>

                                    {/* OPIS PROJEKTU */}
                                    {order.description && (
                                        <div className="mt-6 border-t border-white/10 pt-5">
                                            <p className="mb-2 text-xs text-zinc-500">
                                                Opis projektu
                                            </p>

                                            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                                                {order.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* CZAT Z ADMINISTRATOREM */}
                                    <div className="mt-7 border-t border-white/10 pt-6">
                                        <div className="flex flex-col gap-4 rounded-xl border border-violet-500/15 bg-violet-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                                                    <MessageCircle size={22} />
                                                </div>

                                                <div>
                                                    <h4 className="font-semibold text-white">
                                                        Kontakt w sprawie projektu
                                                    </h4>

                                                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                                                        Wiadomości, zdjęcia i ustalenia
                                                        dotyczące zamówienia #{order.id}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setChatOrder(order)}
                                                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                                            >
                                                <MessageCircle size={17} />
                                                Otwórz czat
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                    </div>
                </section>
            </div>

            {/* OKNO CZATU */}
            {chatOrder && (
                <OrderChat
                    orderId={chatOrder.id}
                    orderTitle={
                        chatOrder.business_name ||
                        `Strona internetowa — ${chatOrder.package}`
                    }
                    onClose={() => setChatOrder(null)}
                />
            )}
        </main>
    );
}
