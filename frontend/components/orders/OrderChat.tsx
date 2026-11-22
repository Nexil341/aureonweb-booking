
"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    ImagePlus,
    Loader2,
    MessageCircle,
    Send,
    Trash2,
    X,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MAX_FILES = 4;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Attachment = {
    id: string;
    filename: string;
    mimeType: string;
    size: number;
};

type ChatMessage = {
    id: number;
    senderId: string;
    content: string;
    createdAt: string;
    attachments?: Attachment[];
};

type Props = {
    orderId: number;
    orderTitle: string;
    onClose: () => void;
};

export default function OrderChat({
    orderId,
    orderTitle,
    onClose,
}: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [myId, setMyId] = useState<string | null>(null);
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const loadMessages = useCallback(
        async (signal?: AbortSignal) => {
            try {
                const response = await fetch(
                    `${API_URL}/api/messages/orders/${orderId}`,
                    {
                        credentials: "include",
                        cache: "no-store",
                        signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        response.status === 403
                            ? "Nie masz dostępu do tego czatu."
                            : "Nie udało się pobrać wiadomości."
                    );
                }

                const data = await response.json();
                const list = Array.isArray(data) ? data : data.messages;

                if (!Array.isArray(list)) {
                    throw new Error("Niepoprawna odpowiedź serwera.");
                }

                if (!signal?.aborted) {
                    setMessages(list);
                    setError("");
                }
            } catch (err) {
                if (signal?.aborted) return;
                setError(
                    err instanceof Error ? err.message : "Wystąpił błąd."
                );
            } finally {
                if (!signal?.aborted) setLoading(false);
            }
        },
        [orderId]
    );

    useEffect(() => {
        const controller = new AbortController();

        void loadMessages(controller.signal);

        const interval = window.setInterval(() => {
            void loadMessages(controller.signal);
        }, 5000);

        return () => {
            controller.abort();
            window.clearInterval(interval);
        };
    }, [loadMessages]);

    useEffect(() => {
        const controller = new AbortController();

        void fetch(`${API_URL}/api/auth/get-session`, {
            credentials: "include",
            signal: controller.signal,
        })
            .then((response) =>
                response.ok ? response.json() : null
            )
            .then((data) => {
                if (!controller.signal.aborted) {
                    setMyId(data?.user?.id ?? null);
                }
            })
            .catch(() => { });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!loading) {
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages.length, loading]);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") onClose();
        }

        window.addEventListener("keydown", onKeyDown);

        return () =>
            window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(event.target.files ?? []);
        event.target.value = "";

        if (files.length + selected.length > MAX_FILES) {
            setError("Możesz dodać maksymalnie 4 zdjęcia.");
            return;
        }

        if (
            selected.some(
                (file) =>
                    !ACCEPTED_TYPES.includes(file.type) ||
                    file.size > MAX_SIZE
            )
        ) {
            setError(
                "Dozwolone są JPG, PNG i WebP, maksymalnie 5 MB każde."
            );
            return;
        }

        setError("");
        setFiles((current) => [...current, ...selected]);
    }

    async function sendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const content = text.trim();

        if ((!content && files.length === 0) || sending) return;

        if (content.length > 2000) {
            setError("Maksymalnie 2000 znaków.");
            return;
        }

        setSending(true);
        setError("");

        try {
            const form = new FormData();

            form.append("content", content);
            files.forEach((file) => form.append("images", file));

            const response = await fetch(
                `${API_URL}/api/messages/orders/${orderId}`,
                {
                    method: "POST",
                    credentials: "include",
                    body: form,
                }
            );

            if (!response.ok) {
                const payload = await response.json().catch(() => null);

                throw new Error(
                    payload?.error ||
                    payload?.message ||
                    "Nie udało się wysłać wiadomości."
                );
            }

            setText("");
            setFiles([]);
            await loadMessages();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Błąd wysyłania."
            );
        } finally {
            setSending(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Czat zamówienia ${orderId}`}
        >
            <div className="flex h-[min(88vh,800px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-violet-500/20 bg-[#101018] shadow-2xl">
                <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-xl bg-violet-500/15 p-3 text-violet-300">
                            <MessageCircle size={20} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-semibold text-white">
                                Czat z administratorem
                            </h2>

                            <p className="truncate text-xs text-zinc-400">
                                TWÓJ PROJEKT: {orderTitle}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Zamknij czat"
                        className="rounded-lg p-2 text-zinc-400 hover:bg-white/10"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                    {loading && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-violet-400" />
                        </div>
                    )}

                    {!loading && messages.length === 0 && !error && (
                        <div className="py-16 text-center text-sm text-zinc-400">
                            Nie ma jeszcze wiadomości.
                            <p className="mt-2">
                                Napisz do administratora w sprawie projektu.
                            </p>
                        </div>
                    )}

                    {messages.map((message) => {
                        const mine =
                            myId !== null && message.senderId === myId;

                        return (
                            <div
                                key={message.id}
                                className={`flex ${mine ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${mine
                                        ? "bg-violet-600 text-white"
                                        : "border border-white/10 bg-[#1c1c29] text-zinc-100"
                                        }`}
                                >
                                    <p className="mb-2 text-xs font-semibold text-violet-200">
                                        {mine ? "Ty" : "Administrator"}
                                    </p>

                                    {message.content && (
                                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                            {message.content}
                                        </p>
                                    )}

                                    {!!message.attachments?.length && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {message.attachments.map((attachment) => {
                                                const url = `${API_URL}/api/messages/attachments/${encodeURIComponent(
                                                    attachment.id
                                                )}`;

                                                return (
                                                    <a
                                                        key={attachment.id}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={attachment.filename}
                                                    >
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={url}
                                                            alt={attachment.filename}
                                                            className="h-32 w-full rounded-lg border border-white/10 object-cover transition hover:opacity-80"
                                                        />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <p className="mt-2 text-right text-[10px] text-zinc-300">
                                        {new Date(message.createdAt).toLocaleString(
                                            "pl-PL",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    <div ref={bottomRef} />
                </div>

                <form
                    onSubmit={(event) => void sendMessage(event)}
                    className="border-t border-white/10 p-4 sm:p-5"
                >
                    {error && (
                        <p
                            role="alert"
                            className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
                        >
                            {error}
                        </p>
                    )}

                    {files.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {files.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300"
                                >
                                    <ImagePlus size={16} />
                                    <span className="max-w-28 truncate">
                                        {file.name}
                                    </span>

                                    <button
                                        type="button"
                                        aria-label="Usuń zdjęcie"
                                        onClick={() =>
                                            setFiles((current) =>
                                                current.filter((_, i) => i !== index)
                                            )
                                        }
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={chooseFiles}
                    />

                    <div className="flex items-end gap-2">
                        <button
                            type="button"
                            disabled={sending || files.length >= MAX_FILES}
                            onClick={() => inputRef.current?.click()}
                            aria-label="Dodaj zdjęcia"
                            className="rounded-xl border border-white/10 p-3 text-violet-300 transition hover:bg-white/10 disabled:opacity-40"
                        >
                            <ImagePlus size={21} />
                        </button>

                        <textarea
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            maxLength={2000}
                            rows={2}
                            placeholder="Napisz wiadomość..."
                            className="max-h-36 min-h-[48px] flex-1 resize-y rounded-xl border border-white/10 bg-[#08080d] px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                        />

                        <button
                            type="submit"
                            disabled={
                                sending || (!text.trim() && files.length === 0)
                            }
                            aria-label="Wyślij wiadomość"
                            className="rounded-xl bg-violet-600 p-3 text-white transition hover:bg-violet-500 disabled:opacity-40"
                        >
                            {sending ? (
                                <Loader2 className="animate-spin" size={21} />
                            ) : (
                                <Send size={21} />
                            )}
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                        Do 4 zdjęć · JPG, PNG, WebP · maks. 5 MB każde
                    </p>
                </form>
            </div>
        </div>
    );
}
