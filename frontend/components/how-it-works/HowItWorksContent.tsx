
"use client";

import { motion, useReducedMotion } from "motion/react";
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    CreditCard,
    Globe2,
    LayoutDashboard,
    MessageSquareText,
    MousePointer2,
    Rocket,
    ShieldCheck,
    Sparkles,
    WandSparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

const steps = [
    {
        id: "choose",
        number: "01",
        icon: MousePointer2,
        tags: ["01 / SELECT", "PACKAGE"],
    },
    {
        id: "brief",
        number: "02",
        icon: ClipboardList,
        tags: ["02 / BRIEF", "DETAILS"],
    },
    {
        id: "confirm",
        number: "03",
        icon: CreditCard,
        tags: ["03 / CONFIRM", "ORDER"],
    },
    {
        id: "progress",
        number: "04",
        icon: LayoutDashboard,
        tags: ["04 / TRACK", "PROGRESS"],
    },
    {
        id: "launch",
        number: "05",
        icon: Rocket,
        tags: ["05 / LAUNCH", "ONLINE"],
    },
] as const;

const benefits = [
    { id: "transparent", icon: ShieldCheck },
    { id: "control", icon: LayoutDashboard },
    { id: "quality", icon: WandSparkles },
] as const;

export default function HowItWorksContent() {
    const t = useTranslations("HowItWorks");
    const reduceMotion = useReducedMotion();
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const fadeUp = {
        hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#08080d] text-white">
            {/* BACKGROUND */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute left-1/2 top-[-180px] h-[600px] w-[850px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[130px]" />
                <div className="absolute right-[-250px] top-[900px] h-[650px] w-[650px] rounded-full bg-fuchsia-700/10 blur-[140px]" />
                <div className="absolute bottom-[300px] left-[-250px] h-[650px] w-[650px] rounded-full bg-violet-700/10 blur-[140px]" />
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
                        backgroundSize: "72px 72px",
                        maskImage:
                            "linear-gradient(to bottom, black, transparent 70%)",
                    }}
                />
            </div>

            {/* HERO */}
            <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-28 text-center sm:px-8 md:pb-32 md:pt-36">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.65 }}
                    className="mx-auto max-w-4xl"
                >
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                        <Sparkles size={14} />
                        {t("hero.badge")}
                    </div>

                    <h1 className="text-5xl font-black leading-[1.08] tracking-[-0.055em] sm:text-6xl md:text-7xl lg:text-[88px]">
                        {t("hero.title")}
                        <br />
                        <span className="bg-gradient-to-r from-violet-300 via-violet-500 to-fuchsia-400 bg-clip-text text-transparent">
                            {t("hero.highlight")}
                        </span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
                        {t("hero.description")}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/oferta"
                            className="group inline-flex min-h-13 items-center gap-3 rounded-xl bg-violet-600 px-7 py-4 text-sm font-bold text-white shadow-[0_0_40px_rgba(124,58,237,0.28)] transition hover:bg-violet-500"
                        >
                            {t("hero.primary")}
                            <ArrowUpRight
                                size={17}
                                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                            />
                        </Link>

                        <a
                            href="#process"
                            className="inline-flex min-h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-zinc-300 transition hover:border-violet-500/40 hover:text-white"
                        >
                            {t("hero.secondary")}
                            <ChevronDown size={16} />
                        </a>
                    </div>
                </motion.div>

                {/* FLOATING PREVIEW */}
                <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 55 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="relative mx-auto mt-20 max-w-4xl"
                >
                    <div className="absolute -inset-5 rounded-[36px] bg-violet-600/10 blur-3xl" />

                    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#11111b] p-5 shadow-2xl sm:p-8">
                        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
                                    <LayoutDashboard size={19} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold">AUREONWEB</p>
                                    <p className="text-xs text-zinc-500">
                                        {t("preview.subtitle")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                                <span className="h-2 w-2 rounded-full bg-zinc-700" />
                                <span className="h-2 w-2 rounded-full bg-violet-500" />
                            </div>
                        </div>

                        <div className="grid gap-6 text-left md:grid-cols-[1fr_240px]">
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-xs font-medium text-zinc-500">
                                        {t("preview.progressLabel")}
                                    </span>
                                    <span className="text-xs font-bold text-violet-300">
                                        3 / 5
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "60%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.4, delay: 0.3 }}
                                        className="h-full rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-400"
                                    />
                                </div>

                                <div className="mt-8 space-y-4">
                                    {[
                                        "preview.item1",
                                        "preview.item2",
                                        "preview.item3",
                                    ].map((key, index) => (
                                        <div
                                            key={key}
                                            className="flex items-center gap-3 text-sm text-zinc-300"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                className={
                                                    index < 2
                                                        ? "text-emerald-400"
                                                        : "text-violet-400"
                                                }
                                            />
                                            {t(key)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center rounded-2xl border border-violet-500/15 bg-violet-500/[0.07] p-6">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                                    <Globe2 size={23} />
                                </div>
                                <p className="text-xs uppercase tracking-widest text-zinc-500">
                                    {t("preview.statusLabel")}
                                </p>
                                <p className="mt-2 text-xl font-bold text-white">
                                    {t("preview.status")}
                                </p>
                                <p className="mt-2 text-xs leading-6 text-zinc-400">
                                    {t("preview.note")}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-zinc-500">
                        {t("preview.disclaimer")}
                    </p>
                </motion.div>
            </section>

            {/* PROCESS */}
            <section
                id="process"
                className="relative mx-auto max-w-6xl scroll-mt-28 px-5 py-24 sm:px-8"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="mb-20 text-center"
                >
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                        {t("process.eyebrow")}
                    </p>
                    <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                        {t("process.title")}{" "}
                        <span className="text-violet-400">
                            {t("process.highlight")}
                        </span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl leading-7 text-zinc-400">
                        {t("process.description")}
                    </p>
                </motion.div>

                <div className="relative">
                    <div className="absolute bottom-20 left-[27px] top-12 w-px bg-gradient-to-b from-violet-500/60 via-violet-500/25 to-transparent md:left-1/2 md:-translate-x-1/2" />

                    <div className="space-y-10 md:space-y-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const reversed = index % 2 === 1;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{
                                        opacity: 0,
                                        x: reduceMotion ? 0 : reversed ? 45 : -45,
                                    }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.2 }}
                                    transition={{ duration: 0.65 }}
                                    className={`relative flex pl-20 md:w-1/2 md:pl-0 ${reversed
                                        ? "md:ml-auto md:pl-14"
                                        : "md:pr-14"
                                        }`}
                                >
                                    {/* TIMELINE NODE */}
                                    <div
                                        className={`absolute left-0 top-7 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/30 bg-[#171124] text-violet-300 shadow-[0_0_30px_rgba(139,92,246,0.18)] ${reversed
                                            ? "md:-left-7"
                                            : "md:left-auto md:-right-7"
                                            }`}
                                    >
                                        <Icon size={23} />
                                    </div>

                                    <div className="group relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#11111b]/90 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_20px_60px_rgba(91,33,182,0.12)] sm:p-8">
                                        <div className="pointer-events-none absolute -right-6 -top-12 text-[120px] font-black tracking-tighter text-white/[0.025]">
                                            {step.number}
                                        </div>

                                        <div className="relative">
                                            <div className="mb-7 flex items-center justify-between gap-3">
                                                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-bold tracking-widest text-violet-300">
                                                    {step.tags[0]}
                                                </span>
                                                <span className="text-xs font-semibold text-zinc-600">
                                                    {step.number} / 05
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                                {t(`steps.${step.id}.title`)}
                                            </h3>
                                            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                                {t(`steps.${step.id}.description`)}
                                            </p>

                                            <div className="mt-7 flex flex-wrap gap-2">
                                                {[0, 1, 2].map((i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-xs text-zinc-300"
                                                    >
                                                        <Check size={13} className="text-violet-400" />
                                                        {t(`steps.${step.id}.point${i + 1}`)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8">
                <div className="mb-12 max-w-2xl">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                        {t("benefits.eyebrow")}
                    </p>
                    <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                        {t("benefits.title")}
                    </h2>
                    <p className="mt-5 leading-7 text-zinc-400">
                        {t("benefits.description")}
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={benefit.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="rounded-[24px] border border-white/10 bg-[#11111b] p-8 transition-colors hover:border-violet-500/30"
                            >
                                <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                                    <Icon size={25} />
                                </div>
                                <h3 className="text-xl font-bold">
                                    {t(`benefits.${benefit.id}.title`)}
                                </h3>
                                <p className="mt-4 text-sm leading-7 text-zinc-400">
                                    {t(`benefits.${benefit.id}.description`)}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* FAQ */}
            <section className="relative mx-auto max-w-4xl px-5 py-24 sm:px-8">
                <div className="mb-12 text-center">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
                        FAQ
                    </p>
                    <h2 className="text-4xl font-black md:text-5xl">
                        {t("faq.title")}
                    </h2>
                </div>

                <div className="space-y-3">
                    {[0, 1, 2, 3].map((index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-white/10 bg-[#11111b]"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenFaq(openFaq === index ? null : index)
                                }
                                aria-expanded={openFaq === index}
                                className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left text-sm font-semibold sm:text-base"
                            >
                                {t(`faq.items.${index}.question`)}
                                <ChevronDown
                                    size={19}
                                    className={`shrink-0 text-violet-400 transition-transform ${openFaq === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openFaq === index && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-6 pb-6 text-sm leading-7 text-zinc-400">
                                        {t(`faq.items.${index}.answer`)}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="relative mx-auto max-w-7xl px-5 pb-28 pt-12 sm:px-8">
                <div className="relative overflow-hidden rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-[#1b1231] via-[#130f20] to-[#0d0c13] px-6 py-20 text-center sm:px-12">
                    <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />
                    <div className="relative">
                        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-violet-300">
                            <MessageSquareText size={28} />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                            {t("cta.title")}
                            <br />
                            <span className="text-violet-400">
                                {t("cta.highlight")}
                            </span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl leading-8 text-zinc-400">
                            {t("cta.description")}
                        </p>
                        <Link
                            href="/oferta"
                            className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-violet-500"
                        >
                            {t("cta.button")}
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
