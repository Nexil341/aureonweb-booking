
"use client";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import {
    ArrowLeft,
    Camera,
    CheckCircle2,
    KeyRound,
    Loader2,
    LogOut,
    Mail,
    Save,
    ShieldCheck,
    Trash2,
    UserRound,
} from "lucide-react";

const inputClass =
    "h-12 w-full rounded-xl border border-white/10 bg-[#0b0b13] px-4 text-sm text-white outline-none transition focus:border-violet-500 disabled:opacity-50";

function getInitials(name: string) {
    return (
        name.trim().split(/\s+/).slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase())
            .join("") || "U"
    );
}

async function processAvatar(file: File): Promise<string> {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        throw new Error("Wybierz zdjęcie JPG, PNG lub WebP.");
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Maksymalny rozmiar zdjęcia to 5 MB.");
    }

    const url = URL.createObjectURL(file);

    try {
        const image = new Image();
        image.src = url;
        await image.decode();

        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Nie można przetworzyć zdjęcia.");

        const side = Math.min(image.width, image.height);

        ctx.drawImage(
            image,
            (image.width - side) / 2,
            (image.height - side) / 2,
            side,
            side,
            0,
            0,
            256,
            256
        );

        return canvas.toDataURL("image/jpeg", 0.75);
    } finally {
        URL.revokeObjectURL(url);
    }
}

function Section({
    title,
    description,
    icon: Icon,
    children,
}: {
    title: string;
    description: string;
    icon: typeof UserRound;
    children: ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-white/10 bg-[#11111b] p-6 sm:p-8">
            <div className="flex items-start gap-4">
                <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                    <Icon size={21} />
                </div>
                <div>
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{description}</p>
                </div>
            </div>
            <div className="mt-7">{children}</div>
        </section>
    );
}

function Message({
    error,
    success,
}: {
    error?: string;
    success?: string;
}) {
    if (!error && !success) return null;

    return (
        <div
            role={error ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${error
                    ? "border-red-500/20 bg-red-500/10 text-red-300"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                }`}
        >
            <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
            <span>{error || success}</span>
        </div>
    );
}

export default function MyAccountPage() {
    const router = useRouter();
    const locale = useLocale();

    const { data: session, isPending, refetch } =
        authClient.useSession();

    const user = session?.user;

    const fileRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const [avatarSuccess, setAvatarSuccess] = useState("");

    const [nameLoading, setNameLoading] = useState(false);
    const [nameError, setNameError] = useState("");
    const [nameSuccess, setNameSuccess] = useState("");

    const [newEmail, setNewEmail] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [emailSuccess, setEmailSuccess] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name ?? "");
            setAvatar(user.image ?? null);
        }
    }, [user?.id, user?.name, user?.image]);

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/logowanie");
        }
    }, [isPending, user, router]);

    async function handleAvatarChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file || !user || avatarLoading) return;

        setAvatarError("");
        setAvatarSuccess("");
        setAvatarLoading(true);

        try {
            const image = await processAvatar(file);

            const { error } = await authClient.updateUser({
                image,
            });

            if (error) {
                throw new Error(error.message || "Błąd zapisu zdjęcia.");
            }

            setAvatar(image);
            await refetch();
            setAvatarSuccess("Avatar został zaktualizowany.");
        } catch (error) {
            setAvatarError(
                error instanceof Error
                    ? error.message
                    : "Nie udało się zmienić avatara."
            );
        } finally {
            setAvatarLoading(false);
        }
    }

    async function handleRemoveAvatar() {
        if (!user || avatarLoading) return;

        setAvatarError("");
        setAvatarSuccess("");
        setAvatarLoading(true);

        try {
            const { error } = await authClient.updateUser({
                image: null,
            });

            if (error) {
                throw new Error(error.message || "Błąd usuwania.");
            }

            setAvatar(null);
            await refetch();
            setAvatarSuccess("Avatar został usunięty.");
        } catch (error) {
            setAvatarError(
                error instanceof Error
                    ? error.message
                    : "Nie udało się usunąć avatara."
            );
        } finally {
            setAvatarLoading(false);
        }
    }

    async function handleUpdateName(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user || nameLoading) return;

        setNameError("");
        setNameSuccess("");

        const cleanName = name.trim();

        if (cleanName.length < 2 || cleanName.length > 100) {
            setNameError("Nazwa musi mieć od 2 do 100 znaków.");
            return;
        }

        setNameLoading(true);

        try {
            const { error } = await authClient.updateUser({
                name: cleanName,
            });

            if (error) {
                setNameError(error.message || "Błąd zapisu nazwy.");
                return;
            }

            await refetch();
            setNameSuccess("Nazwa profilu została zmieniona.");
        } catch {
            setNameError("Błąd połączenia z serwerem.");
        } finally {
            setNameLoading(false);
        }
    }

    async function handleChangeEmail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user || emailLoading) return;

        setEmailError("");
        setEmailSuccess("");

        const cleanEmail = newEmail.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            setEmailError("Podaj poprawny adres e-mail.");
            return;
        }

        if (cleanEmail === user.email.toLowerCase()) {
            setEmailError("To jest już Twój obecny adres.");
            return;
        }

        setEmailLoading(true);

        try {
            const { error } = await authClient.changeEmail({
                newEmail: cleanEmail,
                callbackURL: `${window.location.origin}/${locale}/moje-konto`,
            });

            if (error) {
                setEmailError(
                    error.message || "Nie udało się rozpocząć zmiany e-maila."
                );
                return;
            }

            setEmailSuccess(
                "Rozpoczęto proces zmiany e-maila. Sprawdź wiadomości na obecnej skrzynce, a następnie na nowej."
            );

            setNewEmail("");
        } catch {
            setEmailError("Błąd połączenia z serwerem.");
        } finally {
            setEmailLoading(false);
        }
    }

    async function handleChangePassword(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        if (!user || passwordLoading) return;

        setPasswordError("");
        setPasswordSuccess("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Uzupełnij wszystkie pola.");
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError("Hasło musi mieć minimum 8 znaków.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("Nowe hasła nie są identyczne.");
            return;
        }

        if (newPassword === currentPassword) {
            setPasswordError("Nowe hasło musi różnić się od obecnego.");
            return;
        }

        setPasswordLoading(true);

        try {
            const { error } = await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                setPasswordError(
                    "Nie udało się zmienić hasła. Sprawdź obecne hasło."
                );
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setPasswordSuccess(
                "Hasło zostało zmienione. Inne sesje unieważniono."
            );
        } catch {
            setPasswordError("Błąd połączenia z serwerem.");
        } finally {
            setPasswordLoading(false);
        }
    }

    async function handleLogout() {
        if (logoutLoading) return;

        setLogoutLoading(true);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                setAvatarError("Nie udało się wylogować.");
                return;
            }

            router.replace("/logowanie");
            router.refresh();
        } catch {
            setAvatarError("Błąd połączenia z serwerem.");
        } finally {
            setLogoutLoading(false);
        }
    }

    if (isPending || !user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#08080d]">
                <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
            </main>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#08080d] px-5 pb-24 pt-28 text-white sm:px-8">
            <div className="pointer-events-none absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-violet-700/10 blur-[130px]" />

            <div className="relative mx-auto max-w-6xl">
                <Link
                    href="/moje-zamowienia"
                    className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Powrót do panelu
                </Link>

                <div className="mb-10 mt-9">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                        AUREONWEB / ACCOUNT
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        Ustawienia <span className="text-violet-400">konta.</span>
                    </h1>

                    <p className="mt-4 text-zinc-400">
                        Zarządzaj profilem, adresem e-mail i bezpieczeństwem.
                    </p>
                </div>

                {/* PROFILE HEADER */}
                <section className="rounded-3xl border border-violet-500/15 bg-[#11111b] p-6 sm:p-8">
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                        <div className="relative">
                            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-600 to-fuchsia-700 text-3xl font-bold">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    getInitials(user.name || user.email)
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={avatarLoading}
                                aria-label="Zmień avatar"
                                className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50"
                            >
                                {avatarLoading ? (
                                    <Loader2 size={17} className="animate-spin" />
                                ) : (
                                    <Camera size={17} />
                                )}
                            </button>
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-2xl font-bold">
                                {user.name}
                            </h2>
                            <p className="mt-1 truncate text-sm text-zinc-400">
                                {user.email}
                            </p>

                            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300">
                                <ShieldCheck size={14} />
                                AUREONWEB MEMBER
                            </div>
                        </div>
                    </div>
                </section>

                {/* AVATAR */}
                <div className="mt-6">
                    <Section
                        title="Zdjęcie profilowe"
                        description="Personalizuj swój avatar."
                        icon={Camera}
                    >
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                            aria-label="Wybierz zdjęcie"
                        />

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                disabled={avatarLoading}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                            >
                                <Camera size={17} />
                                {avatar ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
                            </button>

                            {avatar && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    disabled={avatarLoading}
                                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-500/20 px-5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    Usuń zdjęcie
                                </button>
                            )}
                        </div>

                        <p className="mt-4 text-xs text-zinc-500">
                            JPG, PNG, WebP • Maksymalnie 5 MB
                        </p>

                        <div className="mt-4">
                            <Message
                                error={avatarError}
                                success={avatarSuccess}
                            />
                        </div>
                    </Section>
                </div>

                {/* PROFILE + PASSWORD */}
                <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
                    <Section
                        title="Dane osobowe"
                        description="Zmień nazwę wyświetlaną w profilu."
                        icon={UserRound}
                    >
                        <form
                            onSubmit={handleUpdateName}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="profile-name"
                                    className="mb-2 block text-sm text-zinc-300"
                                >
                                    Nazwa użytkownika
                                </label>
                                <input
                                    id="profile-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    maxLength={100}
                                    required
                                    disabled={nameLoading}
                                    className={inputClass}
                                />
                            </div>

                            <Message
                                error={nameError}
                                success={nameSuccess}
                            />

                            <button
                                type="submit"
                                disabled={nameLoading}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                            >
                                {nameLoading ? (
                                    <Loader2 size={17} className="animate-spin" />
                                ) : (
                                    <Save size={17} />
                                )}
                                Zapisz dane
                            </button>
                        </form>
                    </Section>

                    <Section
                        title="Bezpieczeństwo"
                        description="Zmień hasło do swojego konta."
                        icon={KeyRound}
                    >
                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="mb-2 block text-sm text-zinc-300"
                                >
                                    Obecne hasło
                                </label>
                                <input
                                    id="current-password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    required
                                    disabled={passwordLoading}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="mb-2 block text-sm text-zinc-300"
                                >
                                    Nowe hasło
                                </label>
                                <input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    minLength={8}
                                    required
                                    disabled={passwordLoading}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="mb-2 block text-sm text-zinc-300"
                                >
                                    Potwierdź nowe hasło
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                    disabled={passwordLoading}
                                    className={inputClass}
                                />
                            </div>

                            <Message
                                error={passwordError}
                                success={passwordSuccess}
                            />

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                            >
                                {passwordLoading ? (
                                    <Loader2 size={17} className="animate-spin" />
                                ) : (
                                    <KeyRound size={17} />
                                )}
                                Zmień hasło
                            </button>
                        </form>
                    </Section>
                </div>

                {/* CHANGE EMAIL */}
                <div className="mt-6">
                    <Section
                        title="Adres e-mail"
                        description="Zmień adres przypisany do konta. Zmiana wymaga potwierdzenia."
                        icon={Mail}
                    >
                        <form
                            onSubmit={handleChangeEmail}
                            className="max-w-xl space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="current-email"
                                    className="mb-2 block text-sm text-zinc-300"
                                >
                                    Obecny adres e-mail
                                </label>
                                <input
                                    id="current-email"
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="new-email"
                                    className="mb-2 block text-sm text-zinc-300"
                                >
                                    Nowy adres e-mail
                                </label>
                                <input
                                    id="new-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="nowy@email.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    required
                                    disabled={emailLoading}
                                    className={inputClass}
                                />
                            </div>

                            <Message
                                error={emailError}
                                success={emailSuccess}
                            />

                            <button
                                type="submit"
                                disabled={emailLoading}
                                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                            >
                                {emailLoading ? (
                                    <Loader2 size={17} className="animate-spin" />
                                ) : (
                                    <Mail size={17} />
                                )}
                                Wyślij potwierdzenie
                            </button>

                            <p className="text-xs leading-6 text-zinc-500">
                                Jeśli obecny adres jest zweryfikowany,
                                najpierw potwierdzisz zmianę na starej skrzynce.
                                Następnie potwierdzisz nowy adres.
                            </p>
                        </form>
                    </Section>
                </div>

                {/* LOGOUT */}
                <section className="mt-6 flex flex-col gap-4 rounded-3xl border border-red-500/10 bg-[#11111b] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <h2 className="font-bold">Wylogowanie</h2>
                        <p className="mt-2 text-sm text-zinc-500">
                            Bezpiecznie zakończ bieżącą sesję.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-5 text-sm font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                    >
                        <LogOut size={17} />
                        {logoutLoading ? "Wylogowywanie..." : "Wyloguj się"}
                    </button>
                </section>
            </div>
        </main>
    );
}
