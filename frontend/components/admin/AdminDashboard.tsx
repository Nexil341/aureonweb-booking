
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Link } from "@/i18n/navigation";
import AdminMessages from "./AdminMessages";

import {
    Activity,
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    CreditCard,
    Download,
    FolderKanban,
    LayoutDashboard,
    Loader2,
    MessageCircle,
    RefreshCw,
    Search,
    ShieldCheck,
    TrendingUp,
    Users,
    Wallet,
    X,
} from "lucide-react";

const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

type Status =
    | "NEW"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

type Tab =
    | "dashboard"
    | "analytics"
    | "orders"
    | "clients"
    | "messages";

type Order = {
    id: number;
    customer_name: string;
    customer_email: string;
    business_name: string | null;
    description: string | null;
    inspiration: string | null;
    package: string;
    price: number;
    hosting: boolean;
    seo: boolean;
    payment_status: string;
    order_status: string;
    progress: number;
    stage: number;
    deadline: string | null;
    created_at: string | null;
    userId: string | null;
};

type Draft = {
    order: Order;
    status: Status;
    progress: number;
    stage: number;
    deadline: string;
};

type Client = {
    id: string;
    name: string;
    email: string;
    orders: Order[];
};

const statuses: Status[] = [
    "NEW",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
];

const statusNames: Record<Status, string> = {
    NEW: "Nowe",
    IN_PROGRESS: "W realizacji",
    COMPLETED: "Ukończone",
    CANCELLED: "Anulowane",
};

const statusColors: Record<Status, string> = {
    NEW: "bg-amber-500/10 text-amber-300",
    IN_PROGRESS: "bg-violet-500/10 text-violet-300",
    COMPLETED: "bg-emerald-500/10 text-emerald-300",
    CANCELLED: "bg-red-500/10 text-red-300",
};

const panel =
    "rounded-2xl border border-white/10 bg-[#13131d] p-5";

const field =
    "w-full rounded-xl border border-white/10 bg-[#090911] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500";

const money = (grosze: number) =>
    new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(grosze / 100);

const formatDate = (value: string | null) =>
    value
        ? new Date(value).toLocaleDateString("pl-PL")
        : "Nie ustalono";

const validStatus = (value: string): Status =>
    statuses.includes(value as Status)
        ? (value as Status)
        : "NEW";

const navigation = [
    {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        id: "analytics",
        label: "Analityka",
        icon: BarChart3,
    },
    {
        id: "orders",
        label: "Zamówienia",
        icon: ClipboardList,
    },
    {
        id: "clients",
        label: "Klienci",
        icon: Users,
    },
    {
        id: "messages",
        label: "Wiadomości",
        icon: MessageCircle,
    },
] as const;

// ========================================
// WYKRES ROZKŁADU
// ========================================

function Distribution({
    items,
}: {
    items: {
        name: string;
        count: number;
        color: string;
    }[];
}) {
    const total = items.reduce(
        (sum, item) => sum + item.count,
        0
    );

    return (
        <div className="space-y-5">
            {items.map((item) => (
                <div key={item.name}>
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="text-zinc-300">
                            {item.name}
                        </span>

                        <span>
                            {item.count}{" "}
                            <span className="text-zinc-500">
                                (
                                {total
                                    ? Math.round(
                                        (item.count / total) * 100
                                    )
                                    : 0}
                                %)
                            </span>
                        </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{
                                width: `${total
                                        ? (item.count / total) * 100
                                        : 0
                                    }%`,
                            }}
                        />
                    </div>
                </div>
            ))}

            {!total && (
                <p className="text-sm text-zinc-500">
                    Brak danych.
                </p>
            )}
        </div>
    );
}

// ========================================
// WYKRES PRZYCHODÓW
// ========================================

function RevenueChart({
    data,
}: {
    data: {
        label: string;
        value: number;
    }[];
}) {
    const max = Math.max(
        1,
        ...data.map((item) => item.value)
    );

    const width = 700;
    const height = 230;
    const left = 55;
    const top = 20;
    const plotHeight = 170;
    const plotWidth = 620;

    const points = data.map((item, index) => ({
        ...item,
        x:
            left +
            (index * plotWidth) /
            Math.max(1, data.length - 1),
        y:
            top +
            plotHeight * (1 - item.value / max),
    }));

    const line = points
        .map(
            (point, index) =>
                `${index ? "L" : "M"} ${point.x} ${point.y}`
        )
        .join(" ");

    const area = points.length
        ? `${line} L ${points[points.length - 1].x
        } ${top + plotHeight} L ${points[0].x
        } ${top + plotHeight} Z`
        : "";

    return (
        <div className="overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full min-w-[450px]"
                role="img"
                aria-label="Przychody z opłaconych zamówień"
            >
                <defs>
                    <linearGradient
                        id="adminRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity=".4"
                        />
                        <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map(
                    (value) => {
                        const y =
                            top +
                            plotHeight * (1 - value);

                        return (
                            <g key={value}>
                                <line
                                    x1={left}
                                    x2={width - 15}
                                    y1={y}
                                    y2={y}
                                    stroke="#ffffff"
                                    strokeOpacity=".09"
                                    strokeDasharray="4 5"
                                />

                                <text
                                    x={left - 8}
                                    y={y + 4}
                                    fill="#71717a"
                                    textAnchor="end"
                                    fontSize="11"
                                >
                                    {Math.round(
                                        (max * value) / 100
                                    )}{" "}
                                    zł
                                </text>
                            </g>
                        );
                    }
                )}

                <path
                    d={area}
                    fill="url(#adminRevenue)"
                />

                <path
                    d={line}
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#a78bfa"
                        >
                            <title>
                                {point.label}:{" "}
                                {money(point.value)}
                            </title>
                        </circle>

                        <text
                            x={point.x}
                            y={height - 10}
                            fill="#a1a1aa"
                            textAnchor="middle"
                            fontSize="12"
                        >
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}

// ========================================
// GŁÓWNY PANEL ADMINISTRATORA
// ========================================

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);

    const [tab, setTab] =
        useState<Tab>("dashboard");

    const [query, setQuery] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [paymentFilter, setPaymentFilter] =
        useState("all");

    const [draft, setDraft] =
        useState<Draft | null>(null);

    const [selectedClient, setSelectedClient] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    // ========================================
    // POBIERANIE ZAMÓWIEŃ
    // ========================================

    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API}/api/admin/orders`,
                {
                    credentials: "include",
                    cache: "no-store",
                }
            );

            if (response.status === 401) {
                throw new Error(
                    "Zaloguj się na konto administratora."
                );
            }

            if (response.status === 403) {
                throw new Error(
                    "Nie masz uprawnień administratora."
                );
            }

            if (!response.ok) {
                throw new Error(
                    "Nie udało się pobrać zamówień."
                );
            }

            const data = await response.json();

            if (!Array.isArray(data.orders)) {
                throw new Error(
                    "Niepoprawna odpowiedź serwera."
                );
            }

            setOrders(data.orders);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Błąd połączenia."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadOrders();
    }, [loadOrders]);

    // ========================================
    // KLIENCI
    // ========================================

    const clients = useMemo(() => {
        const map = new Map<string, Client>();

        for (const order of orders) {
            const id =
                order.userId ||
                order.customer_email.toLowerCase();

            const existing = map.get(id);

            if (existing) {
                existing.orders.push(order);
            } else {
                map.set(id, {
                    id,
                    name: order.customer_name,
                    email: order.customer_email,
                    orders: [order],
                });
            }
        }

        return Array.from(map.values());
    }, [orders]);

    // ========================================
    // STATYSTYKI
    // ========================================

    const paid = orders.filter(
        (order) =>
            order.payment_status === "PAID"
    );

    const revenue = paid.reduce(
        (sum, order) => sum + order.price,
        0
    );

    const active = orders.filter(
        (order) =>
            order.order_status === "IN_PROGRESS"
    ).length;

    const completed = orders.filter(
        (order) =>
            order.order_status === "COMPLETED"
    ).length;

    const pending = orders.filter(
        (order) =>
            order.payment_status === "PENDING"
    ).length;

    const avgProgress = orders.length
        ? Math.round(
            orders.reduce(
                (sum, order) =>
                    sum + order.progress,
                0
            ) / orders.length
        )
        : 0;

    const monthly = useMemo(() => {
        const now = new Date();

        return Array.from(
            { length: 6 },
            (_, index) => {
                const month = new Date(
                    now.getFullYear(),
                    now.getMonth() - 5 + index,
                    1
                );

                const monthOrders = orders.filter(
                    (order) => {
                        if (
                            order.payment_status !== "PAID" ||
                            !order.created_at
                        ) {
                            return false;
                        }

                        const created = new Date(
                            order.created_at
                        );

                        return (
                            created.getFullYear() ===
                            month.getFullYear() &&
                            created.getMonth() ===
                            month.getMonth()
                        );
                    }
                );

                return {
                    label: month.toLocaleDateString(
                        "pl-PL",
                        { month: "short" }
                    ),
                    value: monthOrders.reduce(
                        (sum, order) =>
                            sum + order.price,
                        0
                    ),
                };
            }
        );
    }, [orders]);

    // ========================================
    // FILTRY
    // ========================================

    const filteredOrders = orders.filter(
        (order) => {
            const search = query.toLowerCase();

            const matchesStatus =
                statusFilter === "all" ||
                order.order_status === statusFilter;

            const matchesPayment =
                paymentFilter === "all" ||
                order.payment_status === paymentFilter;

            const matchesSearch = [
                String(order.id),
                order.customer_name,
                order.customer_email,
                order.business_name || "",
                order.package,
            ].some((value) =>
                value.toLowerCase().includes(search)
            );

            return (
                matchesStatus &&
                matchesPayment &&
                matchesSearch
            );
        }
    );

    const filteredClients = clients.filter(
        (client) =>
            [client.name, client.email].some(
                (value) =>
                    value
                        .toLowerCase()
                        .includes(query.toLowerCase())
            )
    );

    const selected = clients.find(
        (client) =>
            client.id === selectedClient
    );

    const statusData = statuses.map(
        (status, index) => ({
            name: statusNames[status],
            count: orders.filter(
                (order) =>
                    order.order_status === status
            ).length,
            color: [
                "bg-amber-400",
                "bg-violet-500",
                "bg-emerald-400",
                "bg-red-400",
            ][index],
        })
    );

    const packageData = [
        ...new Set(
            orders.map((order) => order.package)
        ),
    ].map((pkg, index) => ({
        name: pkg,
        count: orders.filter(
            (order) => order.package === pkg
        ).length,
        color: [
            "bg-violet-500",
            "bg-fuchsia-500",
            "bg-sky-500",
        ][index % 3],
    }));

    // ========================================
    // EDYCJA ZAMÓWIENIA
    // ========================================

    function openOrder(order: Order) {
        setSelectedClient(null);
        setNotice("");

        setDraft({
            order,
            status: validStatus(
                order.order_status
            ),
            progress: order.progress,
            stage: order.stage,
            deadline: order.deadline
                ? order.deadline.slice(0, 10)
                : "",
        });
    }

    async function saveOrder() {
        if (!draft || saving) return;

        setSaving(true);
        setNotice("");

        try {
            const response = await fetch(
                `${API}/api/admin/orders/${draft.order.id}/progress`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: draft.status,
                        progress:
                            draft.status === "COMPLETED"
                                ? 100
                                : draft.progress,
                        stage: draft.stage,
                        deadline: draft.deadline
                            ? new Date(
                                `${draft.deadline}T12:00:00Z`
                            ).toISOString()
                            : null,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Błąd zapisu."
                );
            }

            setOrders((previous) =>
                previous.map((order) =>
                    order.id === draft.order.id
                        ? data.order
                        : order
                )
            );

            setDraft(null);
        } catch (err) {
            setNotice(
                err instanceof Error
                    ? err.message
                    : "Błąd zapisu."
            );
        } finally {
            setSaving(false);
        }
    }

    // ========================================
    // EKSPORT CSV
    // ========================================

    function exportCsv() {
        const headers = [
            "ID",
            "Klient",
            "Email",
            "Firma",
            "Pakiet",
            "Cena PLN",
            "Płatność",
            "Status",
            "Postęp",
            "Etap",
        ];

        const rows = filteredOrders.map(
            (order) => [
                order.id,
                order.customer_name,
                order.customer_email,
                order.business_name || "",
                order.package,
                (order.price / 100).toFixed(2),
                order.payment_status,
                order.order_status,
                order.progress,
                order.stage,
            ]
        );

        const escape = (value: unknown) =>
            `"${String(value ?? "").replace(
                /"/g,
                '""'
            )}"`;

        const csv = [headers, ...rows]
            .map((row) =>
                row.map(escape).join(";")
            )
            .join("\r\n");

        const blob = new Blob(
            ["\uFEFF", csv],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const anchor =
            document.createElement("a");

        anchor.href = url;
        anchor.download =
            "aureonweb-zamowienia.csv";

        anchor.click();

        URL.revokeObjectURL(url);
    }

    const stats = [
        {
            title: "Wszystkie zamówienia",
            value: orders.length,
            icon: ClipboardList,
        },
        {
            title: "Przychód z opłaconych",
            value: money(revenue),
            icon: Wallet,
        },
        {
            title: "Aktywne projekty",
            value: active,
            icon: FolderKanban,
        },
        {
            title: "Klienci z zamówieniami",
            value: clients.length,
            icon: Users,
        },
        {
            title: "Opłacone zamówienia",
            value: paid.length,
            icon: CreditCard,
        },
        {
            title: "Oczekujące płatności",
            value: pending,
            icon: Activity,
        },
        {
            title: "Ukończone projekty",
            value: completed,
            icon: CheckCircle2,
        },
        {
            title: "Średni postęp",
            value: `${avgProgress}%`,
            icon: TrendingUp,
        },
    ];

    const titles: Record<Tab, string> = {
        dashboard: "Dashboard",
        analytics: "Analityka",
        orders: "Zamówienia",
        clients: "Klienci",
        messages: "Wiadomości",
    };

    // ========================================
    // WIDOK
    // ========================================

    return (
        <main className="min-h-screen bg-[#08080d] text-white">
            <div className="mx-auto flex max-w-[1700px] flex-col lg:min-h-screen lg:flex-row">

                {/* MENU BOCZNE */}

                <aside className="border-b border-white/10 bg-[#101018] p-6 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="rounded-xl bg-violet-600/20 p-3 text-violet-300">
                            <ShieldCheck size={24} />
                        </div>

                        <div>
                            <h2 className="font-black tracking-wider">
                                AUREONWEB
                            </h2>

                            <p className="text-xs text-violet-400">
                                ADMIN PRO
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-wrap gap-2 lg:flex-col">
                        {navigation.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    setTab(item.id);
                                    setQuery("");
                                }}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${tab === item.id
                                        ? "bg-violet-600/20 text-violet-200"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon size={18} />

                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <Link
                        href="/"
                        className="mt-10 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft size={16} />

                        Wróć na stronę
                    </Link>
                </aside>

                {/* ZAWARTOŚĆ PANELU */}

                <section className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-violet-400">
                                AUREONWEB STUDIO / MANAGEMENT
                            </p>

                            <h1 className="text-3xl font-bold sm:text-4xl">
                                {titles[tab]}
                            </h1>

                            <p className="mt-2 text-sm text-zinc-400">
                                Zarządzanie projektami,
                                sprzedażą i klientami.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadOrders()}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Odśwież dane
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center gap-3 py-20 text-zinc-400">
                            <Loader2 className="animate-spin" />

                            Pobieranie danych...
                        </div>
                    ) : error ? null : (
                        <>
                            {/* DASHBOARD */}

                            {tab === "dashboard" && (
                                <>
                                    <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        {stats.map((stat) => (
                                            <div
                                                key={stat.title}
                                                className={panel}
                                            >
                                                <div className="mb-5 flex items-center justify-between">
                                                    <stat.icon
                                                        size={23}
                                                        className="text-violet-400"
                                                    />

                                                    <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-300">
                                                        LIVE DATA
                                                    </span>
                                                </div>

                                                <div className="text-2xl font-bold">
                                                    {stat.value}
                                                </div>

                                                <div className="mt-2 text-xs text-zinc-400">
                                                    {stat.title}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-7 grid gap-5 xl:grid-cols-3">
                                        <div
                                            className={`${panel} xl:col-span-2`}
                                        >
                                            <div className="mb-6 flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-bold">
                                                        Przychody
                                                    </h2>

                                                    <p className="text-xs text-zinc-500">
                                                        Opłacone zamówienia ·
                                                        ostatnie 6 miesięcy
                                                    </p>
                                                </div>

                                                <TrendingUp className="text-violet-400" />
                                            </div>

                                            <RevenueChart
                                                data={monthly}
                                            />
                                        </div>

                                        <div className={panel}>
                                            <h2 className="mb-6 text-lg font-bold">
                                                Statusy projektów
                                            </h2>

                                            <Distribution
                                                items={statusData}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-7 grid gap-5 xl:grid-cols-2">
                                        <div className={panel}>
                                            <h2 className="mb-6 text-lg font-bold">
                                                Popularność pakietów
                                            </h2>

                                            <Distribution
                                                items={packageData}
                                            />
                                        </div>

                                        <div className={panel}>
                                            <h2 className="mb-6 text-lg font-bold">
                                                Podsumowanie sprzedaży
                                            </h2>

                                            <div className="space-y-4">
                                                {[
                                                    [
                                                        "Łączna wartość opłaconych",
                                                        money(revenue),
                                                    ],
                                                    [
                                                        "Średnia wartość opłaconego zamówienia",
                                                        money(
                                                            paid.length
                                                                ? revenue /
                                                                paid.length
                                                                : 0
                                                        ),
                                                    ],
                                                    [
                                                        "Udział opłaconych",
                                                        `${orders.length
                                                            ? Math.round(
                                                                (paid.length /
                                                                    orders.length) *
                                                                100
                                                            )
                                                            : 0
                                                        }%`,
                                                    ],
                                                    [
                                                        "Udział ukończonych",
                                                        `${orders.length
                                                            ? Math.round(
                                                                (completed /
                                                                    orders.length) *
                                                                100
                                                            )
                                                            : 0
                                                        }%`,
                                                    ],
                                                ].map(
                                                    ([label, value]) => (
                                                        <div
                                                            key={label}
                                                            className="flex justify-between gap-3 border-b border-white/5 pb-3 text-sm"
                                                        >
                                                            <span className="text-zinc-400">
                                                                {label}
                                                            </span>

                                                            <strong>
                                                                {value}
                                                            </strong>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ANALITYKA */}

                            {tab === "analytics" && (
                                <div className="space-y-6">
                                    <div className={panel}>
                                        <h2 className="mb-6 text-lg font-bold">
                                            Analiza przychodów
                                        </h2>

                                        <RevenueChart
                                            data={monthly}
                                        />
                                    </div>

                                    <div className="grid gap-5 lg:grid-cols-2">
                                        <div className={panel}>
                                            <h2 className="mb-6 text-lg font-bold">
                                                Pakiety
                                            </h2>

                                            <Distribution
                                                items={packageData}
                                            />
                                        </div>

                                        <div className={panel}>
                                            <h2 className="mb-6 text-lg font-bold">
                                                Realizacja projektów
                                            </h2>

                                            <Distribution
                                                items={statusData}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ZAMÓWIENIA */}

                            {(tab === "dashboard" ||
                                tab === "orders") && (
                                    <div className={panel}>
                                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                            <h2 className="text-lg font-bold">
                                                {tab === "dashboard"
                                                    ? "Ostatnie zamówienia"
                                                    : "Wszystkie zamówienia"}
                                            </h2>

                                            <div className="flex flex-wrap gap-2">
                                                <input
                                                    value={query}
                                                    onChange={(event) =>
                                                        setQuery(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Szukaj zamówienia..."
                                                    className={field}
                                                />

                                                <select
                                                    value={statusFilter}
                                                    onChange={(event) =>
                                                        setStatusFilter(
                                                            event.target.value
                                                        )
                                                    }
                                                    className={field}
                                                >
                                                    <option value="all">
                                                        Wszystkie statusy
                                                    </option>

                                                    {statuses.map(
                                                        (status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {
                                                                    statusNames[
                                                                    status
                                                                    ]
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                <select
                                                    value={paymentFilter}
                                                    onChange={(event) =>
                                                        setPaymentFilter(
                                                            event.target.value
                                                        )
                                                    }
                                                    className={field}
                                                >
                                                    <option value="all">
                                                        Wszystkie płatności
                                                    </option>

                                                    <option value="PAID">
                                                        Opłacone
                                                    </option>

                                                    <option value="PENDING">
                                                        Oczekujące
                                                    </option>

                                                    <option value="FAILED">
                                                        Nieudane
                                                    </option>
                                                </select>

                                                {tab === "orders" && (
                                                    <button
                                                        type="button"
                                                        onClick={exportCsv}
                                                        className="flex items-center gap-2 rounded-xl border border-violet-500/30 px-4 py-2 text-sm text-violet-300"
                                                    >
                                                        <Download size={16} />

                                                        CSV
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {(tab === "dashboard"
                                                ? filteredOrders.slice(
                                                    0,
                                                    6
                                                )
                                                : filteredOrders
                                            ).map((order) => (
                                                <button
                                                    key={order.id}
                                                    type="button"
                                                    onClick={() =>
                                                        openOrder(order)
                                                    }
                                                    className="flex w-full flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.025] p-4 text-left transition hover:border-violet-500/40"
                                                >
                                                    <div>
                                                        <div className="font-semibold">
                                                            {order.business_name ||
                                                                `Strona ${order.package}`}

                                                            <span className="ml-2 text-xs font-normal text-zinc-500">
                                                                #{order.id}
                                                            </span>
                                                        </div>

                                                        <div className="mt-1 text-xs text-zinc-400">
                                                            {
                                                                order.customer_name
                                                            }{" "}
                                                            · {order.package}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs ${statusColors[
                                                                validStatus(
                                                                    order.order_status
                                                                )
                                                                ]
                                                                }`}
                                                        >
                                                            {
                                                                statusNames[
                                                                validStatus(
                                                                    order.order_status
                                                                )
                                                                ]
                                                            }
                                                        </span>

                                                        <div className="text-right">
                                                            <div className="text-sm font-bold">
                                                                {money(
                                                                    order.price
                                                                )}
                                                            </div>

                                                            <div
                                                                className={`text-xs ${order.payment_status ===
                                                                        "PAID"
                                                                        ? "text-emerald-400"
                                                                        : "text-amber-400"
                                                                    }`}
                                                            >
                                                                {order.payment_status ===
                                                                    "PAID"
                                                                    ? "Opłacone"
                                                                    : order.payment_status}
                                                            </div>
                                                        </div>

                                                        <ChevronRight
                                                            size={17}
                                                        />
                                                    </div>
                                                </button>
                                            ))}

                                            {!filteredOrders.length && (
                                                <p className="py-8 text-center text-sm text-zinc-500">
                                                    Brak zamówień.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* KLIENCI */}

                            {tab === "clients" && (
                                <div className={panel}>
                                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-lg font-bold">
                                            Klienci (
                                            {filteredClients.length})
                                        </h2>

                                        <div className="relative">
                                            <Search
                                                size={16}
                                                className="absolute left-3 top-3 text-zinc-500"
                                            />

                                            <input
                                                value={query}
                                                onChange={(event) =>
                                                    setQuery(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Szukaj klienta..."
                                                className={`${field} pl-10`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {filteredClients.map(
                                            (client) => (
                                                <button
                                                    key={client.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedClient(
                                                            client.id
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between rounded-xl border border-white/10 p-4 text-left hover:border-violet-500/40"
                                                >
                                                    <div>
                                                        <div className="font-semibold">
                                                            {client.name}
                                                        </div>

                                                        <div className="mt-1 text-xs text-zinc-400">
                                                            {client.email}
                                                        </div>
                                                    </div>

                                                    <span className="flex items-center gap-2 text-sm text-violet-300">
                                                        {
                                                            client.orders
                                                                .length
                                                        }{" "}
                                                        zam.

                                                        <ChevronRight
                                                            size={17}
                                                        />
                                                    </span>
                                                </button>
                                            )
                                        )}

                                        {!filteredClients.length && (
                                            <p className="py-8 text-center text-sm text-zinc-500">
                                                Brak klientów z
                                                zamówieniami.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* WIADOMOŚCI - NOWA ZAKŁADKA */}

                            {tab === "messages" && (
                                <AdminMessages
                                    orders={orders}
                                />
                            )}
                        </>
                    )}
                </section>
            </div>

            {/* MODAL EDYCJI ZAMÓWIENIA */}

            {draft && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#171722] p-6 sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <p className="text-xs text-violet-300">
                                    ZAMÓWIENIE #
                                    {draft.order.id}
                                </p>

                                <h2 className="mt-1 text-2xl font-bold">
                                    {draft.order.business_name ||
                                        draft.order.package}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setDraft(null)
                                }
                                aria-label="Zamknij"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="mb-5 rounded-xl bg-white/[.035] p-4 text-sm">
                            <p>
                                Klient:{" "}
                                {
                                    draft.order
                                        .customer_name
                                }
                            </p>

                            <a
                                href={`mailto:${draft.order.customer_email}`}
                                className="mt-2 block text-violet-300"
                            >
                                {
                                    draft.order
                                        .customer_email
                                }
                            </a>

                            <p className="mt-2">
                                Pakiet:{" "}
                                {draft.order.package} ·{" "}
                                {money(
                                    draft.order.price
                                )}
                            </p>

                            <p className="mt-2">
                                Płatność:{" "}
                                <strong>
                                    {
                                        draft.order
                                            .payment_status
                                    }
                                </strong>
                            </p>
                        </div>

                        <p className="mb-6 whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                            {draft.order.description ||
                                "Brak opisu projektu."}
                        </p>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="text-sm">
                                Status projektu

                                <select
                                    className={`${field} mt-2`}
                                    value={draft.status}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            status:
                                                event.target
                                                    .value as Status,
                                        })
                                    }
                                >
                                    {statuses.map(
                                        (status) => (
                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {
                                                    statusNames[
                                                    status
                                                    ]
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>

                            <label className="text-sm">
                                Termin realizacji

                                <input
                                    type="date"
                                    className={`${field} mt-2`}
                                    value={draft.deadline}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            deadline:
                                                event.target.value,
                                        })
                                    }
                                />
                            </label>

                            <label className="text-sm">
                                Postęp:{" "}
                                {draft.status ===
                                    "COMPLETED"
                                    ? 100
                                    : draft.progress}
                                %

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    className="mt-5 w-full accent-violet-500"
                                    value={
                                        draft.status ===
                                            "COMPLETED"
                                            ? 100
                                            : draft.progress
                                    }
                                    disabled={
                                        draft.status ===
                                        "COMPLETED"
                                    }
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            progress: Number(
                                                event.target.value
                                            ),
                                        })
                                    }
                                />
                            </label>

                            <label className="text-sm">
                                Etap realizacji

                                <select
                                    className={`${field} mt-2`}
                                    value={draft.stage}
                                    onChange={(event) =>
                                        setDraft({
                                            ...draft,
                                            stage: Number(
                                                event.target.value
                                            ),
                                        })
                                    }
                                >
                                    {[
                                        0, 1, 2, 3, 4, 5,
                                    ].map((number) => (
                                        <option
                                            key={number}
                                            value={number}
                                        >
                                            {number} z 5
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="mt-6 rounded-xl border border-white/10 p-4 text-sm text-zinc-400">
                            <p>
                                Hosting:{" "}
                                {draft.order.hosting
                                    ? "Tak"
                                    : "Nie"}
                            </p>

                            <p className="mt-2">
                                SEO:{" "}
                                {draft.order.seo
                                    ? "Tak"
                                    : "Nie"}
                            </p>

                            <p className="mt-2">
                                Złożono:{" "}
                                {formatDate(
                                    draft.order.created_at
                                )}
                            </p>
                        </div>

                        {draft.order.payment_status !==
                            "PAID" && (
                                <p className="mt-4 text-sm text-amber-300">
                                    Nieopłacone zamówienie —
                                    edycja postępu zablokowana.
                                </p>
                            )}

                        {notice && (
                            <p
                                role="status"
                                className="mt-4 text-sm text-violet-200"
                            >
                                {notice}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                void saveOrder()
                            }
                            disabled={
                                saving ||
                                draft.order
                                    .payment_status !==
                                "PAID"
                            }
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2
                                    className="animate-spin"
                                    size={18}
                                />
                            ) : (
                                <CheckCircle2
                                    size={18}
                                />
                            )}

                            {saving
                                ? "Zapisywanie..."
                                : "Zapisz zmiany"}
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL KLIENTA */}

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-[#171722] p-6">
                        <div className="mb-5 flex justify-between">
                            <div>
                                <p className="text-xs text-violet-400">
                                    KARTA KLIENTA
                                </p>

                                <h2 className="mt-1 text-2xl font-bold">
                                    {selected.name}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedClient(null)
                                }
                                aria-label="Zamknij kartę klienta"
                            >
                                <X />
                            </button>
                        </div>

                        <a
                            href={`mailto:${selected.email}`}
                            className="text-sm text-violet-300"
                        >
                            {selected.email}
                        </a>

                        <h3 className="mb-3 mt-6 font-semibold">
                            Historia zamówień
                        </h3>

                        <div className="space-y-2">
                            {selected.orders.map(
                                (order) => (
                                    <button
                                        key={order.id}
                                        type="button"
                                        onClick={() =>
                                            openOrder(order)
                                        }
                                        className="flex w-full justify-between rounded-xl border border-white/10 p-3 text-left text-sm hover:border-violet-500/40"
                                    >
                                        <span>
                                            {order.business_name ||
                                                order.package}{" "}
                                            #{order.id}
                                        </span>

                                        <span className="text-violet-300">
                                            {
                                                statusNames[
                                                validStatus(
                                                    order.order_status
                                                )
                                                ]
                                            }
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
