
import {
    ArrowRight,
    ArrowUpRight,
    Code2,
    Mail,
    MapPin,
    Sparkles,
    Zap,
} from "lucide-react";

import { FaGithub, FaInstagram } from "react-icons/fa";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";


export default async function Footer() {
    const t = await getTranslations("Footer");

    const navigation = [
        { label: t("navigation.home"), href: "/" },
        { label: t("navigation.offer"), href: "/oferta" },
        { label: t("navigation.about"), href: "/o-nas" },
        { label: t("navigation.contact"), href: "/kontakt" },
    ] as const;

    const services = [
        { label: t("services.websites"), href: "/oferta" },
        { label: t("services.webapps"), href: "/oferta" },
        { label: t("services.automations"), href: "/oferta" },
    ] as const;

    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-[#09090f] text-white">
            {/* BACKGROUND GLOW */}
            <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />

            <div className="relative mx-auto max-w-7xl px-6">

                {/* CTA */}
                <div className="flex flex-col gap-8 border-b border-white/10 py-16 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300">
                            <Sparkles className="h-4 w-4" />
                            {t("cta.badge")}
                        </div>

                        <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                            {t("cta.title")}{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {t("cta.highlight")}
                            </span>
                        </h2>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400">
                            {t("cta.description")}
                        </p>
                    </div>

                    <Link
                        href="/oferta"
                        className="group inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-xl bg-violet-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 lg:self-auto"
                    >
                        {t("cta.button")}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* MAIN FOOTER */}
                <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">

                    {/* BRAND */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
                                <Zap className="h-6 w-6 text-white" />
                            </div>

                            <div>
                                <span className="block text-xl font-bold tracking-tight">
                                    AUREONWEB
                                </span>
                                <span className="block text-[10px] font-medium tracking-[0.35em] text-violet-400">
                                    STUDIO
                                </span>
                            </div>
                        </Link>

                        <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
                            {t("brand.description")}
                        </p>

                        {/* SOCIAL MEDIA */}
                        <div className="mt-7 flex items-center gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
                            >
                                <FaGithub className="h-5 w-5" />
                            </a>

                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
                            >
                                <FaInstagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* NAVIGATION */}
                    <div>
                        <h3 className="mb-7 text-sm font-semibold tracking-wide text-white">
                            {t("navigation.title")}
                        </h3>

                        <ul className="space-y-4">
                            {navigation.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-violet-400"
                                    >
                                        <ArrowRight className="h-3 w-3 text-violet-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SERVICES */}
                    <div>
                        <h3 className="mb-7 text-sm font-semibold tracking-wide text-white">
                            {t("services.title")}
                        </h3>

                        <ul className="space-y-4">
                            {services.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-violet-400"
                                    >
                                        <ArrowRight className="h-3 w-3 text-violet-500 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CONTACT */}
                <div className="flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">

                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                                <Mail className="h-4 w-4 text-violet-400" />
                            </div>
                            <span>{t("contact.email")}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-zinc-400">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                                <MapPin className="h-4 w-4 text-violet-400" />
                            </div>
                            <span>{t("contact.location")}</span>
                        </div>
                    </div>

                    <Link
                        href="/kontakt"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
                    >
                        {t("contact.button")}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                </div>

                {/* BOTTOM BAR */}
                <div className="flex flex-col gap-5 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">

                    {/* COPYRIGHT */}
                    <p className="text-xs text-zinc-500">
                        © {new Date().getFullYear()} AUREONWEB STUDIO.{" "}
                        {t("copyright")}
                    </p>

                    {/* LEGAL LINKS */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            href="/regulamin"
                            className="text-xs font-medium text-zinc-400 transition-colors hover:text-violet-400"
                        >
                            {t("terms")}
                        </Link>
                    </div>

                    {/* CREDITS */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Code2 className="h-4 w-4 text-violet-400" />
                        <span>{t("credits")}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
