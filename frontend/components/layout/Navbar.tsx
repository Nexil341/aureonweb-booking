
"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import {
    Menu,
    X,
    ChevronDown,
    ArrowUpRight,
    Globe2,
    Package,
    Settings,
    LogOut,
    LayoutDashboard,
} from "lucide-react";

function getInitials(name: string) {
    return (
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase() || "U"
    );
}

function Avatar({
    name,
    image,
    size = "normal",
}: {
    name: string;
    image?: string | null;
    size?: "normal" | "large";
}) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [image]);

    return (
        <span
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-300/25 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.2)] ${size === "large"
                    ? "h-11 w-11 text-sm"
                    : "h-8 w-8 text-xs"
                }`}
        >
            {image && !imageError ? (
                <img
                    src={image}
                    alt="Zdjęcie profilowe"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                getInitials(name)
            )}
        </span>
    );
}

export default function Navbar() {
    const t = useTranslations("Navbar");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const { data: session, isPending, refetch } =
        authClient.useSession();

    const user = session?.user ?? null;

    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState(false);

    const languageRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);

    const labels =
        locale === "en"
            ? {
                orders: "My orders",
                account: "Account settings",
                dashboard: "Dashboard",
                logout: "Log out",
                loggingOut: "Logging out...",
                logoutError: "Could not log out. Try again.",
                openMenu: "Open menu",
                closeMenu: "Close menu",
                accountMenu: "Account menu",
                signedIn: "Signed in as",
            }
            : {
                orders: "Moje zamówienia",
                account: "Ustawienia konta",
                dashboard: "Panel klienta",
                logout: "Wyloguj się",
                loggingOut: "Wylogowywanie...",
                logoutError: "Nie udało się wylogować. Spróbuj ponownie.",
                openMenu: "Otwórz menu",
                closeMenu: "Zamknij menu",
                accountMenu: "Menu konta",
                signedIn: "Zalogowano jako",
            };

    const navigation = [
        { label: t("home"), href: "/" },
        { label: t("offer"), href: "/oferta" },
        { label: t("howItWorks"), href: "/jak-to-dziala" },
        { label: t("about"), href: "/o-nas" },
        { label: t("contact"), href: "/kontakt" },
    ] as const;

    // Synchronizacja danych konta po zmianie strony.
    useEffect(() => {
        setMenuOpen(false);
        setLanguageOpen(false);
        setAccountOpen(false);

        void refetch();
    }, [pathname, locale, refetch]);

    // Odświeżenie sesji po powrocie do karty.
    useEffect(() => {
        function handleFocus() {
            void refetch();
        }

        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [refetch]);

    // Zamykanie menu po kliknięciu poza nim.
    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            const target = event.target;

            if (!(target instanceof Node)) return;

            if (
                languageRef.current &&
                !languageRef.current.contains(target)
            ) {
                setLanguageOpen(false);
            }

            if (
                accountRef.current &&
                !accountRef.current.contains(target)
            ) {
                setAccountOpen(false);
            }
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setLanguageOpen(false);
                setAccountOpen(false);
                setMenuOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown
            );
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function changeLanguage(nextLocale: "pl" | "en") {
        setLanguageOpen(false);
        setAccountOpen(false);
        setMenuOpen(false);

        if (nextLocale === locale) return;

        router.replace(pathname, { locale: nextLocale });
    }

    function isActive(href: string) {
        if (href === "/") return pathname === "/";

        return (
            pathname === href ||
            pathname.startsWith(`${href}/`)
        );
    }

    async function handleLogout() {
        if (loggingOut) return;

        setLoggingOut(true);
        setLogoutError(false);

        try {
            const { error } = await authClient.signOut();

            if (error) {
                setLogoutError(true);
                return;
            }

            setAccountOpen(false);
            setMenuOpen(false);

            router.replace("/");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
            setLogoutError(true);
        } finally {
            setLoggingOut(false);
        }
    }

    const navClass = (href: string) =>
        `flex min-w-[100px] items-center justify-center whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-medium transition-colors ${isActive(href)
            ? "bg-violet-500/15 text-violet-300"
            : "text-zinc-400 hover:bg-white/[0.07] hover:text-white"
        }`;

    const mobileNavClass = (href: string) =>
        `rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors ${isActive(href)
            ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
            : "border-white/[0.05] bg-white/[0.025] text-zinc-300 hover:border-violet-500/30 hover:text-white"
        }`;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08080d]/95 backdrop-blur-xl">
            <div className="mx-auto grid h-20 max-w-[1440px] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 xl:grid-cols-[220px_minmax(0,1fr)_360px] xl:px-10">
                {/* LOGO */}
                <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-fit shrink-0 items-center gap-3"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-600/15 shadow-[0_0_25px_rgba(139,92,246,0.15)]">
                        <span className="text-xl font-black text-violet-400">
                            A
                        </span>
                    </div>

                    <div className="flex flex-col leading-tight">
                        <span className="text-[15px] font-black tracking-[0.12em] text-white">
                            AUREONWEB
                        </span>
                        <span className="text-[9px] font-semibold tracking-[0.38em] text-violet-400">
                            STUDIO
                        </span>
                    </div>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden w-max items-center justify-self-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1.5 xl:flex">
                    {navigation.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={
                                isActive(item.href) ? "page" : undefined
                            }
                            className={navClass(item.href)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* DESKTOP ACTIONS */}
                <div className="hidden w-[360px] items-center justify-end gap-2 xl:flex">
                    {/* LANGUAGE */}
                    <div ref={languageRef} className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => {
                                setLanguageOpen((prev) => !prev);
                                setAccountOpen(false);
                            }}
                            aria-expanded={languageOpen}
                            aria-label={t("language")}
                            className="flex h-11 w-[80px] items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.035] text-xs font-semibold text-zinc-300 transition-colors hover:border-violet-500/40 hover:text-white"
                        >
                            <Globe2
                                size={15}
                                className="text-violet-400"
                            />
                            <span>{locale.toUpperCase()}</span>
                            <ChevronDown
                                size={12}
                                className={`transition-transform ${languageOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {languageOpen && (
                            <div className="absolute right-0 top-12 z-50 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#14141d] p-1.5 shadow-2xl">
                                {(["pl", "en"] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => changeLanguage(lang)}
                                        className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10 ${locale === lang
                                                ? "bg-violet-500/15 text-violet-300"
                                                : "text-zinc-300"
                                            }`}
                                    >
                                        {lang === "pl"
                                            ? "🇵🇱 Polski"
                                            : "🇬🇧 English"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SESSION */}
                    {isPending ? (
                        <div className="h-11 w-36 animate-pulse rounded-xl bg-white/5" />
                    ) : user ? (
                        <>
                            <Link
                                href="/moje-zamowienia"
                                className="flex h-11 items-center justify-center gap-2 whitespace-nowrap px-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-violet-300"
                            >
                                <Package size={16} />
                                {labels.orders}
                            </Link>

                            {/* ACCOUNT DROPDOWN */}
                            <div ref={accountRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAccountOpen((prev) => !prev);
                                        setLanguageOpen(false);
                                        void refetch();
                                    }}
                                    aria-label={labels.accountMenu}
                                    aria-expanded={accountOpen}
                                    aria-haspopup="menu"
                                    className={`flex h-11 items-center gap-2 rounded-xl border px-2.5 transition ${accountOpen
                                            ? "border-violet-400/50 bg-violet-500/20"
                                            : "border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20"
                                        }`}
                                >
                                    <Avatar
                                        name={user.name || user.email}
                                        image={user.image}
                                    />

                                    <ChevronDown
                                        size={14}
                                        className={`text-violet-300 transition-transform ${accountOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {accountOpen && (
                                    <div
                                        role="menu"
                                        className="absolute right-0 top-14 z-50 w-[290px] overflow-hidden rounded-2xl border border-white/10 bg-[#14141d] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.6)]"
                                    >
                                        {/* PROFILE HEADER */}
                                        <div className="rounded-xl bg-gradient-to-br from-violet-500/15 to-purple-500/5 p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    size="large"
                                                    name={user.name || user.email}
                                                    image={user.image}
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold text-white">
                                                        {user.name}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-zinc-400">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex items-center gap-2 text-[11px] text-violet-300">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                {labels.signedIn}
                                            </div>
                                        </div>

                                        {/* MENU ITEMS */}
                                        <div className="mt-2 space-y-1">
                                            <Link
                                                href="/moje-zamowienia"
                                                role="menuitem"
                                                onClick={() => setAccountOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                                            >
                                                <LayoutDashboard
                                                    size={17}
                                                    className="text-violet-400"
                                                />
                                                {labels.dashboard}
                                            </Link>

                                            <Link
                                                href="/moje-zamowienia"
                                                role="menuitem"
                                                onClick={() => setAccountOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                                            >
                                                <Package
                                                    size={17}
                                                    className="text-zinc-400"
                                                />
                                                {labels.orders}
                                            </Link>

                                            <Link
                                                href="/moje-konto"
                                                role="menuitem"
                                                onClick={() => setAccountOpen(false)}
                                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                                            >
                                                <Settings
                                                    size={17}
                                                    className="text-zinc-400"
                                                />
                                                {labels.account}
                                            </Link>
                                        </div>

                                        <div className="my-2 h-px bg-white/10" />

                                        <button
                                            type="button"
                                            role="menuitem"
                                            onClick={handleLogout}
                                            disabled={loggingOut}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                                        >
                                            <LogOut size={17} />
                                            {loggingOut
                                                ? labels.loggingOut
                                                : labels.logout}
                                        </button>

                                        {logoutError && (
                                            <p
                                                role="alert"
                                                className="px-3 pb-2 text-xs text-red-400"
                                            >
                                                {labels.logoutError}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/logowanie"
                                className="flex h-11 w-[105px] shrink-0 items-center justify-center whitespace-nowrap rounded-xl text-center text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
                            >
                                {t("login")}
                            </Link>

                            <Link
                                href="/rejestracja"
                                className="group flex h-11 w-[145px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-violet-600 text-[13px] font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.25)] transition-colors hover:bg-violet-500"
                            >
                                {t("register")}
                                <ArrowUpRight
                                    size={16}
                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </>
                    )}
                </div>

                {/* MOBILE BUTTON */}
                <button
                    type="button"
                    onClick={() => {
                        setMenuOpen((prev) => !prev);
                        setLanguageOpen(false);
                        setAccountOpen(false);
                    }}
                    aria-label={
                        menuOpen ? labels.closeMenu : labels.openMenu
                    }
                    aria-expanded={menuOpen}
                    className="flex h-11 w-11 items-center justify-center justify-self-end rounded-xl border border-white/10 bg-white/5 text-white xl:hidden"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="border-t border-white/10 bg-[#0b0b12] px-5 py-6 xl:hidden">
                    <div className="mx-auto max-w-7xl">
                        <nav className="flex flex-col gap-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    aria-current={
                                        isActive(item.href) ? "page" : undefined
                                    }
                                    className={mobileNavClass(item.href)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* MOBILE LANGUAGE */}
                        <div className="mt-6">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                {t("language")}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {(["pl", "en"] as const).map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => changeLanguage(lang)}
                                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${locale === lang
                                                ? "border-violet-500/50 bg-violet-500/15 text-violet-300"
                                                : "border-white/10 bg-white/5 text-zinc-400"
                                            }`}
                                    >
                                        {lang === "pl"
                                            ? "🇵🇱 Polski"
                                            : "🇬🇧 English"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MOBILE SESSION */}
                        {isPending ? (
                            <div className="mt-6 h-20 animate-pulse rounded-xl bg-white/5" />
                        ) : user ? (
                            <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
                                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-violet-500/15 bg-violet-500/5 p-4">
                                    <Avatar
                                        size="large"
                                        name={user.name || user.email}
                                        image={user.image}
                                    />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-zinc-500">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/moje-zamowienia"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white"
                                >
                                    <LayoutDashboard
                                        size={18}
                                        className="text-violet-400"
                                    />
                                    {labels.dashboard}
                                </Link>

                                <Link
                                    href="/moje-zamowienia"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white"
                                >
                                    <Package size={18} />
                                    {labels.orders}
                                </Link>

                                <Link
                                    href="/moje-konto"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white"
                                >
                                    <Settings size={18} />
                                    {labels.account}
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex w-full items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3.5 text-left text-sm text-red-400 disabled:opacity-40"
                                >
                                    <LogOut size={18} />
                                    {loggingOut
                                        ? labels.loggingOut
                                        : labels.logout}
                                </button>

                                {logoutError && (
                                    <p
                                        role="alert"
                                        className="px-2 text-xs text-red-400"
                                    >
                                        {labels.logoutError}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Link
                                    href="/logowanie"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-center text-sm font-semibold text-white"
                                >
                                    {t("login")}
                                </Link>

                                <Link
                                    href="/rejestracja"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-3 text-center text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                                >
                                    {t("register")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
