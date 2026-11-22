
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import {
    ArrowRight,
    Check,
    Globe2,
    Code2,
    Zap,
    Headphones,
    Sparkles,
} from "lucide-react";

type PackageId = "starter" | "business" | "premium";
type CareId = "none" | "basic" | "plus";

const packageIds: PackageId[] = [
    "starter",
    "business",
    "premium",
];

const careIds: CareId[] = ["none", "basic", "plus"];

// Ceny przykładowe — potwierdź przed publikacją.
const priceConfig = {
    starter: { base: 149.99, features: 6 },
    business: { base: 299.99, features: 7 },
    premium: { base: 499.99, features: 7 },
} as const;

const careConfig = {
    none: { monthly: 0, discount: 0 },
    basic: { monthly: 50, discount: 0 },
    plus: { monthly: 100, discount: 0 },
} as const;

const money = (value: number) =>
    new Intl.NumberFormat("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

export default function OfferPage() {
    const t = useTranslations("OfferPage");
    const [care, setCare] = useState<CareId>("none");

    const selectedCare = careConfig[care];

    return (
        <main className="min-h-screen overflow-hidden bg-[#08080d] text-white">
            {/* HERO */}
            <section className="relative px-5 pb-20 pt-24 text-center sm:pt-32">
                <div className="pointer-events-none absolute left-1/2 top-12 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[110px]" />

                <div className="relative mx-auto max-w-4xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300">
                        <Sparkles size={14} />
                        AUREONWEB STUDIO
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-black tracking-tight sm:text-6xl"
                    >
                        {t("hero.title")}{" "}
                        <span className="text-violet-400">
                            {t("hero.highlight")}
                        </span>
                    </motion.h1>

                    <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-400">
                        {t("hero.description")}
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <a
                            href="#pakiety"
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500"
                        >
                            {t("hero.primary")}
                            <ArrowRight size={17} />
                        </a>

                        <Link
                            href="/kontakt"
                            className="rounded-xl border border-white/15 px-6 py-3 font-semibold hover:bg-white/10"
                        >
                            {t("hero.secondary")}
                        </Link>
                    </div>

                    <div className="mt-9 flex flex-wrap justify-center gap-5 text-sm text-zinc-400">
                        {(
                            [
                                "responsive",
                                "transparent",
                                "scalable",
                            ] as const
                        ).map((id) => (
                            <span
                                key={id}
                                className="inline-flex items-center gap-2"
                            >
                                <Check
                                    size={16}
                                    className="text-violet-400"
                                />
                                {t(`hero.benefits.${id}`)}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* PACKAGES */}
            <section
                id="pakiety"
                className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-24"
            >
                <div className="mb-10 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                        {t("pricing.eyebrow")}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                        {t("pricing.title")}{" "}
                        <span className="text-violet-400">
                            {t("pricing.highlight")}
                        </span>
                    </h2>

                    <p className="mt-4 text-zinc-400">
                        {t("pricing.description")}
                    </p>
                </div>

                {/* CARE SELECTION */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-[#11111a] p-6">
                    <h3 className="text-xl font-bold">
                        {t("care.title")}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-400">
                        {t("care.description")}
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        {careIds.map((id) => (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={care === id}
                                onClick={() => setCare(id)}
                                className={`rounded-xl border p-4 text-left transition ${care === id
                                        ? "border-violet-500 bg-violet-500/10"
                                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold">
                                        {t(`care.plans.${id}.name`)}
                                    </span>

                                    {care === id && (
                                        <Check
                                            size={18}
                                            className="text-violet-400"
                                        />
                                    )}
                                </div>

                                <p className="mt-2 text-sm text-zinc-400">
                                    {t(`care.plans.${id}.description`)}
                                </p>

                                <p className="mt-3 font-bold text-violet-300">
                                    {id === "none"
                                        ? "0 zł/mies."
                                        : `${money(careConfig[id].monthly)} zł/mies.`}
                                </p>
                            </button>
                        ))}
                    </div>

                    <p className="mt-4 text-xs leading-6 text-zinc-500">
                        {t("care.disclaimer")}
                    </p>
                </div>

                {/* PACKAGE CARDS */}
                <div className="grid gap-5 lg:grid-cols-3">
                    {packageIds.map((id) => {
                        const config = priceConfig[id];

                        const price = Math.max(
                            0,
                            config.base - selectedCare.discount
                        );

                        const highlighted = id === "business";

                        return (
                            <article
                                key={id}
                                className={`relative flex flex-col rounded-2xl border p-7 ${highlighted
                                        ? "border-violet-500 bg-[#1a1329] shadow-[0_0_55px_rgba(124,58,237,0.1)]"
                                        : "border-white/10 bg-[#11111a]"
                                    }`}
                            >
                                {highlighted && (
                                    <div className="absolute -top-3 right-5 rounded-full bg-violet-600 px-3 py-1 text-xs font-bold">
                                        {t("pricing.popular")}
                                    </div>
                                )}

                                <h3 className="text-xl font-bold capitalize text-violet-300">
                                    {id}
                                </h3>

                                <p className="mt-2 text-sm text-zinc-400">
                                    {t(`packages.${id}.subtitle`)}
                                </p>

                                <div className="mt-5 text-4xl font-black">
                                    {money(price)}{" "}
                                    <span className="text-base font-normal text-zinc-400">
                                        {t("common.currency")}
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-zinc-500">
                                    {t("pricing.oneTime")}
                                </p>

                                {selectedCare.monthly > 0 && (
                                    <p className="mt-2 text-sm text-violet-300">
                                        + {money(selectedCare.monthly)}{" "}
                                        {t("common.currency")}
                                        {t("common.perMonth")}
                                    </p>
                                )}

                                <p className="mt-5 min-h-20 text-sm leading-7 text-zinc-400">
                                    {t(`packages.${id}.description`)}
                                </p>

                                <div className="my-6 h-px bg-white/10" />

                                <p className="mb-4 text-sm font-semibold">
                                    {t("pricing.included")}
                                </p>

                                <div className="mb-8 space-y-3">
                                    {Array.from(
                                        { length: config.features },
                                        (_, i) => i + 1
                                    ).map((index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 text-sm text-zinc-300"
                                        >
                                            <Check
                                                size={17}
                                                className="mt-0.5 shrink-0 text-violet-400"
                                            />

                                            {t(
                                                `packages.${id}.features.${index}`
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/zamowienie"
                                    className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${highlighted
                                            ? "bg-violet-600 hover:bg-violet-500"
                                            : "border border-white/15 bg-white/5 hover:bg-white/10"
                                        }`}
                                >
                                    {t("pricing.choose", {
                                        name:
                                            id.charAt(0).toUpperCase() +
                                            id.slice(1),
                                    })}

                                    <ArrowRight size={16} />
                                </Link>
                            </article>
                        );
                    })}
                </div>

                <p className="mt-6 text-center text-xs leading-6 text-zinc-500">
                    {t("pricing.disclaimer")}
                </p>
            </section>

            {/* SERVICES */}
            <section className="border-y border-white/10 bg-[#0e0e16] px-5 py-20">
                <div className="mx-auto max-w-7xl">
                    <p className="text-center text-xs font-bold tracking-widest text-violet-400">
                        {t("services.eyebrow")}
                    </p>

                    <h2 className="mt-3 text-center text-3xl font-bold">
                        {t("services.title")}{" "}
                        <span className="text-violet-400">
                            {t("services.highlight")}
                        </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-400">
                        {t("services.description")}
                    </p>

                    <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {(
                            [
                                "webApps",
                                "automation",
                                "support",
                                "consulting",
                            ] as const
                        ).map((id, i) => {
                            const Icon = [
                                Globe2,
                                Zap,
                                Headphones,
                                Code2,
                            ][i];

                            return (
                                <div
                                    key={id}
                                    className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
                                >
                                    <Icon
                                        size={23}
                                        className="text-violet-400"
                                    />

                                    <h3 className="mt-5 text-lg font-bold">
                                        {t(`services.items.${id}.title`)}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                                        {t(
                                            `services.items.${id}.description`
                                        )}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="mx-auto max-w-5xl px-5 py-20">
                <p className="text-center text-xs font-bold tracking-widest text-violet-400">
                    {t("process.eyebrow")}
                </p>

                <h2 className="mt-3 text-center text-3xl font-bold">
                    {t("process.title")}{" "}
                    <span className="text-violet-400">
                        {t("process.highlight")}
                    </span>
                </h2>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {(
                        ["choose", "discuss", "build"] as const
                    ).map((id, i) => (
                        <div
                            key={id}
                            className="rounded-2xl border border-white/10 bg-[#11111a] p-6"
                        >
                            <span className="text-2xl font-black text-violet-400">
                                0{i + 1}
                            </span>

                            <h3 className="mt-4 font-bold">
                                {t(`process.steps.${id}.title`)}
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                {t(
                                    `process.steps.${id}.description`
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="mx-auto max-w-4xl px-5 pb-24">
                <h2 className="text-center text-3xl font-bold">
                    {t("faq.title")}{" "}
                    <span className="text-violet-400">
                        {t("faq.highlight")}
                    </span>
                </h2>

                <div className="mt-9 space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((id) => (
                        <details
                            key={id}
                            className="group rounded-xl border border-white/10 bg-[#13131d] p-5"
                        >
                            <summary className="cursor-pointer font-semibold marker:text-violet-400">
                                {t(`faq.items.${id}.question`)}
                            </summary>

                            <p className="mt-4 text-sm leading-7 text-zinc-400">
                                {t(`faq.items.${id}.answer`)}
                            </p>
                        </details>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <p className="text-xs font-bold tracking-widest text-violet-400">
                        {t("cta.eyebrow")}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                        {t("cta.title")}{" "}
                        <span className="text-violet-400">
                            {t("cta.highlight")}
                        </span>
                    </h2>

                    <p className="mt-4 text-zinc-400">
                        {t("cta.description")}
                    </p>

                    <Link
                        href="/zamowienie"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500"
                    >
                        {t("cta.button")}
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
