
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
    ArrowLeft,
    FileText,
    ShieldCheck,
    Mail,
    AlertTriangle,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("Terms");

    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
    };
}

export default async function RegulaminPage() {
    const t = await getTranslations("Terms");

    const sections = [
        { title: "general", count: 4 },
        { title: "orders", count: 5 },
        { title: "payments", count: 6 },
        { title: "hosting", count: 6 },
        { title: "copyright", count: 3 },
        { title: "complaints", count: 5 },
        { title: "privacy", count: 3 },
        { title: "final", count: 3 },
    ] as const;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] text-white">
            {/* Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <div className="absolute -top-48 left-1/2 h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-violet-700/10 blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 lg:pt-28">
                <Link
                    href="/"
                    className="mb-12 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    {t("back")}
                </Link>

                {/* Header */}
                <header className="mb-12 max-w-3xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-violet-300">
                        <FileText size={14} />
                        {t("eyebrow")}
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        {t("title")}{" "}
                        <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                            AUREONWEB.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400">
                        {t("description")}
                    </p>

                    <p className="mt-5 text-xs text-zinc-500">
                        {t("version")}
                    </p>
                </header>

                {/* Draft warning */}
                <div className="mb-12 flex gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5 sm:p-6">
                    <AlertTriangle
                        size={21}
                        className="mt-1 shrink-0 text-amber-400"
                    />

                    <div>
                        <h2 className="font-semibold text-amber-200">
                            {t("warningTitle")}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-zinc-400">
                            {t("warningDescription")}
                        </p>
                    </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)]">
                    {/* Table of contents */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                                {t("contents")}
                            </p>

                            <nav className="space-y-1">
                                {sections.map((section, index) => (
                                    <a
                                        key={section.title}
                                        href={`#section-${index + 1}`}
                                        className="block rounded-lg px-3 py-2 text-xs leading-5 text-zinc-400 transition hover:bg-violet-500/10 hover:text-violet-300"
                                    >
                                        §{index + 1}.{" "}
                                        {t(`sections.${section.title}.title`)}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Terms */}
                    <article className="min-w-0 space-y-5">
                        {sections.map((section, index) => (
                            <section
                                id={`section-${index + 1}`}
                                key={section.title}
                                className="scroll-mt-28 rounded-2xl border border-white/[0.07] bg-[#101017]/80 p-6 transition-colors hover:border-violet-500/20 sm:p-8"
                            >
                                <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
                                    §{index + 1}.{" "}
                                    {t(`sections.${section.title}.title`)}
                                </h2>

                                <ol className="space-y-4">
                                    {Array.from(
                                        { length: section.count },
                                        (_, itemIndex) => (
                                            <li
                                                key={itemIndex}
                                                className="flex items-start gap-4 text-sm leading-7 text-zinc-400"
                                            >
                                                <span className="min-w-6 shrink-0 font-medium text-violet-400">
                                                    {itemIndex + 1}.
                                                </span>

                                                <span>
                                                    {t(
                                                        `sections.${section.title}.items.${itemIndex + 1}`
                                                    )}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ol>
                            </section>
                        ))}
                    </article>
                </div>

                {/* Contact */}
                <section className="mt-16 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-[#11101a] to-[#0d0d14] p-7 sm:p-10">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                        <ShieldCheck size={23} className="text-violet-400" />
                    </div>

                    <h2 className="text-2xl font-bold sm:text-3xl">
                        {t("contactTitle")}
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
                        {t("contactDescription")}
                    </p>

                    <a
                        href="mailto:nexilsbusinesss@gmail.com"
                        className="mt-7 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500"
                    >
                        <Mail size={17} />
                        {t("contactButton")}
                    </a>
                </section>
            </div>
        </main>
    );
}
