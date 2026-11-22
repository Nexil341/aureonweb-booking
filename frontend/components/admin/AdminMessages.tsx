
"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from "react";

import {
    ImagePlus,
    Loader2,
    MessageCircle,
    RefreshCw,
    Search,
    Send,
    X,
} from "lucide-react";

const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

type Order = {
    id: number;
    customer_name: string;
    customer_email: string;
    business_name: string | null;
    package: string;
    created_at: string | null;
};

type Attachment = {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
};

type Message = {
    id: number;
    senderId: string;
    content: string;
    createdAt: string;
    attachments?: Attachment[];
};

type Conversation = {
    id: number;
    lastMessage: {
        content: string;
        senderId: string;
        createdAt: string;
    } | null;
};

type Preview = {
    file: File;
    url: string;
};

const imageUrl = (id: string) =>
    `${API}/api/messages/attachments/${encodeURIComponent(id)}`;

const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString(
        "pl-PL",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );

export default function AdminMessages({
    orders = [],
}: {
    orders?: Order[];
}) {
    const [selectedId, setSelectedId] =
        useState<number | null>(null);

    const [conversations, setConversations] =
        useState<Conversation[]>([]);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [currentUserId, setCurrentUserId] =
        useState<string | null>(null);

    const [query, setQuery] = useState("");
    const [content, setContent] = useState("");

    const [previews, setPreviews] =
        useState<Preview[]>([]);

    const [loading, setLoading] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [error, setError] = useState("");

    const fileInput = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const previewsRef = useRef<Preview[]>([]);

    const selectedOrder = orders.find(
        (order) => order.id === selectedId
    );

    const conversationMap = new Map(
        conversations.map((conversation) => [
            conversation.id,
            conversation,
        ])
    );

    const sortedOrders = [...orders]
        .filter((order) =>
            [
                order.customer_name,
                order.customer_email,
                order.business_name || "",
                String(order.id),
            ].some((value) =>
                value
                    .toLowerCase()
                    .includes(query.toLowerCase())
            )
        )
        .sort((a, b) => {
            const aTime =
                conversationMap.get(a.id)?.lastMessage
                    ?.createdAt;

            const bTime =
                conversationMap.get(b.id)?.lastMessage
                    ?.createdAt;

            return (
                (bTime ? new Date(bTime).getTime() : 0) -
                (aTime ? new Date(aTime).getTime() : 0)
            );
        });

    const loadConversations = useCallback(
        async () => {
            try {
                const response = await fetch(
                    `${API}/api/messages/admin/conversations`,
                    {
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                if (!response.ok) return;

                const data = await response.json();

                setConversations(
                    Array.isArray(data.conversations)
                        ? data.conversations
                        : []
                );
            } catch {
                // Ponowimy przy kolejnym odświeżeniu.
            }
        },
        []
    );

    const loadMessages = useCallback(
        async (orderId: number, showLoading = false) => {
            if (showLoading) setLoading(true);

            try {
                const response = await fetch(
                    `${API}/api/messages/orders/${orderId}`,
                    {
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "Nie udało się pobrać wiadomości."
                    );
                }

                setMessages(
                    Array.isArray(data.messages)
                        ? data.messages
                        : []
                );

                setError("");
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Błąd połączenia."
                );
            } finally {
                if (showLoading) setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        async function loadSession() {
            try {
                const response = await fetch(
                    `${API}/api/auth/get-session`,
                    {
                        credentials: "include",
                    }
                );

                if (!response.ok) return;

                const data = await response.json();

                setCurrentUserId(data?.user?.id ?? null);
            } catch {
                setCurrentUserId(null);
            }
        }

        void loadSession();
        void loadConversations();

        const interval = setInterval(
            () => void loadConversations(),
            8000
        );

        return () => clearInterval(interval);
    }, [loadConversations]);

    useEffect(() => {
        if (
            selectedId === null &&
            sortedOrders.length > 0
        ) {
            setSelectedId(sortedOrders[0].id);
        }
    }, [selectedId, sortedOrders.length]);

    useEffect(() => {
        if (selectedId === null) return;

        setMessages([]);
        void loadMessages(selectedId, true);

        const interval = setInterval(
            () => void loadMessages(selectedId),
            5000
        );

        return () => clearInterval(interval);
    }, [selectedId, loadMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages.length]);

    useEffect(() => {
        previewsRef.current = previews;
    }, [previews]);

    useEffect(() => {
        return () => {
            previewsRef.current.forEach((preview) =>
                URL.revokeObjectURL(preview.url)
            );
        };
    }, []);

    function removePreview(index: number) {
        setPreviews((previous) => {
            const removed = previous[index];

            if (removed) {
                URL.revokeObjectURL(removed.url);
            }

            return previous.filter(
                (_, currentIndex) =>
                    currentIndex !== index
            );
        });
    }

    function selectFiles(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) return;

        if (previews.length + files.length > 4) {
            setError(
                "Możesz wysłać maksymalnie 4 zdjęcia."
            );
            event.target.value = "";
            return;
        }

        const allowed = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        for (const file of files) {
            if (!allowed.includes(file.type)) {
                setError(
                    "Dozwolone formaty: JPG, PNG i WebP."
                );
                event.target.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(
                    "Każde zdjęcie może mieć maksymalnie 5 MB."
                );
                event.target.value = "";
                return;
            }
        }

        setPreviews((previous) => [
            ...previous,
            ...files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            })),
        ]);

        setError("");
        event.target.value = "";
    }

    async function sendMessage(event: FormEvent) {
        event.preventDefault();

        if (
            selectedId === null ||
            sending ||
            (!content.trim() && previews.length === 0)
        ) {
            return;
        }

        setSending(true);
        setError("");

        try {
            const formData = new FormData();

            formData.append("content", content.trim());

            previews.forEach(({ file }) => {
                formData.append("images", file);
            });

            const response = await fetch(
                `${API}/api/messages/orders/${selectedId}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Nie udało się wysłać wiadomości."
                );
            }

            setContent("");

            previews.forEach((preview) =>
                URL.revokeObjectURL(preview.url)
            );

            setPreviews([]);

            await Promise.all([
                loadMessages(selectedId),
                loadConversations(),
            ]);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Błąd wysyłania."
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#13131d]">
            <div className="grid min-h-[650px] lg:grid-cols-[300px_minmax(0,1fr)]">

                {/* LISTA ROZMÓW */}

                <aside className="border-b border-white/10 lg:border-b-0 lg:border-r">
                    <div className="border-b border-white/10 p-4">
                        <h2 className="mb-4 flex items-center gap-2 font-semibold">
                            <MessageCircle
                                size={19}
                                className="text-violet-400"
                            />
                            Rozmowy
                        </h2>

                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-3 text-zinc-500"
                            />

                            <input
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Szukaj klienta..."
                                className="w-full rounded-xl border border-white/10 bg-[#090911] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
                            />
                        </div>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto lg:max-h-[580px]">
                        {sortedOrders.map((order) => {
                            const lastMessage =
                                conversationMap.get(order.id)
                                    ?.lastMessage;

                            return (
                                <button
                                    key={order.id}
                                    type="button"
                                    onClick={() =>
                                        setSelectedId(order.id)
                                    }
                                    className={`w-full border-b border-white/5 p-4 text-left transition hover:bg-white/5 ${selectedId === order.id
                                            ? "bg-violet-500/10"
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-sm font-semibold">
                                            {order.customer_name}
                                        </span>

                                        <span className="text-xs text-zinc-500">
                                            #{order.id}
                                        </span>
                                    </div>

                                    <p className="mt-1 truncate text-xs text-zinc-400">
                                        {order.business_name ||
                                            order.package}
                                    </p>

                                    <p className="mt-2 truncate text-xs text-zinc-500">
                                        {lastMessage?.content ||
                                            "Brak wiadomości"}
                                    </p>
                                </button>
                            );
                        })}

                        {!sortedOrders.length && (
                            <p className="p-5 text-sm text-zinc-500">
                                Nie znaleziono zamówień.
                            </p>
                        )}
                    </div>
                </aside>

                {/* OKNO CZATU */}

                <section className="flex min-h-[580px] min-w-0 flex-col">
                    {selectedOrder ? (
                        <>
                            <header className="flex items-center justify-between border-b border-white/10 p-4">
                                <div>
                                    <h3 className="font-semibold">
                                        {selectedOrder.customer_name}
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-400">
                                        {selectedOrder.customer_email}
                                        {" · "}
                                        Zamówienie #{selectedOrder.id}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        void loadMessages(
                                            selectedOrder.id,
                                            true
                                        )
                                    }
                                    className="rounded-lg p-2 text-zinc-400 hover:bg-white/10"
                                    aria-label="Odśwież wiadomości"
                                >
                                    <RefreshCw size={18} />
                                </button>
                            </header>

                            <div className="h-[440px] flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                                {loading && (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-violet-400" />
                                    </div>
                                )}

                                {!loading &&
                                    messages.length === 0 && (
                                        <p className="py-10 text-center text-sm text-zinc-500">
                                            Rozpocznij rozmowę z klientem.
                                        </p>
                                    )}

                                {messages.map((message) => {
                                    const mine =
                                        currentUserId ===
                                        message.senderId;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${mine
                                                    ? "justify-end"
                                                    : "justify-start"
                                                }`}
                                        >
                                            <div
                                                className={`max-w-[90%] rounded-2xl p-3 sm:max-w-[75%] ${mine
                                                        ? "bg-violet-600 text-white"
                                                        : "bg-[#242433] text-zinc-100"
                                                    }`}
                                            >
                                                {message.content && (
                                                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                                        {message.content}
                                                    </p>
                                                )}

                                                {!!message.attachments?.length && (
                                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                                        {message.attachments.map(
                                                            (attachment) => (
                                                                <a
                                                                    key={attachment.id}
                                                                    href={imageUrl(
                                                                        attachment.id
                                                                    )}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block overflow-hidden rounded-lg border border-white/10"
                                                                    title={`Otwórz ${attachment.filename}`}
                                                                >
                                                                    <img
                                                                        src={imageUrl(
                                                                            attachment.id
                                                                        )}
                                                                        alt={
                                                                            attachment.filename
                                                                        }
                                                                        className="h-36 w-full object-cover transition hover:opacity-80"
                                                                        loading="lazy"
                                                                    />
                                                                </a>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                <p className="mt-2 text-right text-[10px] opacity-60">
                                                    {formatTime(
                                                        message.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div ref={bottomRef} />
                            </div>

                            {/* PODGLĄD WYBRANYCH ZDJĘĆ */}

                            {previews.length > 0 && (
                                <div className="flex flex-wrap gap-3 border-t border-white/10 p-3">
                                    {previews.map(
                                        (preview, index) => (
                                            <div
                                                key={preview.url}
                                                className="relative"
                                            >
                                                <img
                                                    src={preview.url}
                                                    alt={
                                                        preview.file.name
                                                    }
                                                    className="h-20 w-20 rounded-lg border border-white/10 object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePreview(index)
                                                    }
                                                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                                                    aria-label="Usuń zdjęcie"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {error && (
                                <p
                                    role="alert"
                                    className="px-4 py-2 text-sm text-red-400"
                                >
                                    {error}
                                </p>
                            )}

                            {/* WYSYŁANIE */}

                            <form
                                onSubmit={sendMessage}
                                className="flex items-end gap-3 border-t border-white/10 p-4"
                            >
                                <input
                                    ref={fileInput}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={selectFiles}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInput.current?.click()
                                    }
                                    disabled={sending}
                                    title="Dodaj zdjęcia"
                                    aria-label="Dodaj zdjęcia"
                                    className="rounded-xl border border-white/10 p-3 text-violet-300 transition hover:bg-violet-500/10 disabled:opacity-50"
                                >
                                    <ImagePlus size={20} />
                                </button>

                                <textarea
                                    value={content}
                                    onChange={(event) =>
                                        setContent(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Napisz wiadomość..."
                                    rows={1}
                                    maxLength={2000}
                                    className="max-h-32 min-h-11 flex-1 resize-y rounded-xl border border-white/10 bg-[#090911] px-4 py-3 text-sm outline-none focus:border-violet-500"
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        sending ||
                                        (!content.trim() &&
                                            previews.length === 0)
                                    }
                                    className="rounded-xl bg-violet-600 p-3 text-white transition hover:bg-violet-500 disabled:opacity-50"
                                    aria-label="Wyślij wiadomość"
                                >
                                    {sending ? (
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                            Wybierz rozmowę.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
