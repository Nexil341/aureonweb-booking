
"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    ArrowRight,
    ArrowUpRight,
    Code2,
    ShieldCheck,
    Sparkles,
    Target,
    Zap,
    CheckCircle2,
    Globe2,
    Layers3,
} from "lucide-react";

export default function AboutContent() {
    const t = useTranslations("AboutPage");
    const reduceMotion = useReducedMotion();

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: reduceMotion ? 0 : 24,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: reduceMotion ? 0 : 0.65,
                ease: "easeOut" as const,
            },
        },
    };

    const values = [
        { icon: Sparkles, key: "design" },
        { icon: Zap, key: "performance" },
        { icon: ShieldCheck, key: "quality" },
        { icon: Target, key: "approach" },
    ] as const;

    const steps = [
        { number: "01", key: "discover" },
        { number: "02", key: "design" },
        { number: "03", key: "develop" },
        { number: "04", key: "deliver" },
    ] as const;

    return (
        <main className="overflow-hidden bg-[#08080d] text-white">
            {/* HERO */}
            <section className="relative isolate flex min-h-[720px] items-center overflow-hidden border-b border-white/[0.06] py-28 lg:min-h-[820px]">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[140px]" />
                    <div className="absolute right-[-100px] top-20 h-[350px] w-[350px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
                    <div
                        className="absolute inset-0 opacity-[0.13]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(167,139,250,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,.15) 1px,transparent 1px)",
                            backgroundSize: "64px 64px",
                            maskImage:
                                "linear-gradient(to bottom,black,transparent 90%)",
                        }}
                    />
                </div>

                <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.1fr_.9fr]">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
                            <Sparkles size={14} />
                            {t("hero.badge")}
                        </div>

                        <h1 className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                            {t("hero.title")}
                            <span className="mt-2 block bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                                {t("hero.highlight")}
                            </span>
                        </h1>

                        <p className="mt-8 max-w-xl text-base leading-8 text-zinc-400 sm:text-lg">
                            {t("hero.description")}
                        </p>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                href="/oferta"
                                className="group inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold transition hover:bg-violet-500"
                            >
                                {t("hero.primary")}
                                <ArrowUpRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </Link>

                            <a
                                href="#philosophy"
                                className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-violet-500/30 hover:text-white"
                            >
                                {t("hero.secondary")}
                                <ArrowRight size={17} />
                            </a>
                        </div>
                    </motion.div>

                    {/* HERO VISUAL */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: reduceMotion ? 1 : 0.9,
                        }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.9,
                            ease: "easeOut",
                        }}
                        className="relative mx-auto flex aspect-square w-full max-w-[500px] items-center justify-center"
                    >
                        <div className="pointer-events-none absolute inset-[15%] rounded-full bg-violet-600/20 blur-[90px]" />

                        <motion.div
                            animate={reduceMotion ? {} : { rotate: 360 }}
                            transition={{
                                duration: 50,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute inset-[4%] rounded-full border border-violet-400/10"
                        >
                            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.8)]" />
                        </motion.div>

                        <motion.div
                            animate={reduceMotion ? {} : { rotate: -360 }}
                            transition={{
                                duration: 35,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute inset-[15%] rounded-full border border-violet-400/15"
                        >
                            <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                        </motion.div>

                        <motion.div
                            animate={reduceMotion ? {} : { y: [0, -10, 0] }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative flex h-56 w-56 items-center justify-center rounded-[48px] border border-violet-400/30 bg-gradient-to-br from-violet-500/20 via-[#191128] to-[#0b0912] shadow-[0_0_110px_rgba(139,92,246,0.2)] backdrop-blur-xl sm:h-72 sm:w-72"
                        >
                            <div className="absolute inset-3 rounded-[38px] border border-white/10" />

                            <span className="bg-gradient-to-br from-white via-violet-200 to-violet-500 bg-clip-text text-[145px] font-black leading-none text-transparent sm:text-[185px]">
                                A
                            </span>
                        </motion.div>

                        <motion.div
                            animate={reduceMotion ? {} : { y: [0, -7, 0] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute left-0 top-[20%] flex items-center gap-2 rounded-xl border border-white/10 bg-[#14121d]/90 px-4 py-3 shadow-xl backdrop-blur-xl"
                        >
                            <Code2 size={17} className="text-violet-400" />
                            <span className="text-xs font-medium text-zinc-300">
                                Next.js
                            </span>
                        </motion.div>

                        <motion.div
                            animate={reduceMotion ? {} : { y: [0, 7, 0] }}
                            transition={{
                                duration: 5.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute bottom-[18%] right-0 flex items-center gap-2 rounded-xl border border-white/10 bg-[#14121d]/90 px-4 py-3 shadow-xl backdrop-blur-xl"
                        >
                            <CheckCircle2 size={17} className="text-violet-400" />
                            <span className="text-xs font-medium text-zinc-300">
                                {t("hero.visualTag")}
                            </span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section
                id="philosophy"
                className="scroll-mt-24 py-24 sm:py-32"
            >
                <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                    >
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                            {t("philosophy.eyebrow")}
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {t("philosophy.title")}
                            <span className="mt-2 block text-violet-400">
                                {t("philosophy.highlight")}
                            </span>
                        </h2>

                        <p className="mt-7 text-sm leading-8 text-zinc-400 sm:text-base">
                            {t("philosophy.description1")}
                        </p>

                        <p className="mt-5 text-sm leading-8 text-zinc-400 sm:text-base">
                            {t("philosophy.description2")}
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="relative rounded-3xl border border-white/10 bg-[#101019] p-7 sm:p-10"
                    >
                        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-600/10 blur-[80px]" />

                        <div className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/25 bg-violet-500/10">
                            <Target size={27} className="text-violet-400" />
                        </div>

                        <h3 className="relative text-2xl font-bold">
                            {t("philosophy.cardTitle")}
                        </h3>

                        <p className="relative mt-5 text-sm leading-8 text-zinc-400">
                            {t("philosophy.cardDescription")}
                        </p>

                        <div className="relative mt-8 flex flex-wrap gap-3">
                            {["Design", "Development", "Performance"].map(
                                (item) => (
                                    <span
                                        key={item}
                                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300"
                                    >
                                        {item}
                                    </span>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* VALUES */}
            <section className="border-y border-white/[0.06] bg-[#0c0c13] py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mb-14 max-w-2xl"
                    >
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                            {t("values.eyebrow")}
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {t("values.title")}
                        </h2>

                        <p className="mt-6 leading-8 text-zinc-400">
                            {t("values.description")}
                        </p>
                    </motion.div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {values.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <motion.div
                                    key={item.key}
                                    initial={{
                                        opacity: 0,
                                        y: reduceMotion ? 0 : 22,
                                    }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.55,
                                        delay: reduceMotion ? 0 : index * 0.08,
                                    }}
                                    whileHover={reduceMotion ? {} : { y: -4 }}
                                    className="group rounded-2xl border border-white/[0.08] bg-[#12121b] p-8 transition-colors hover:border-violet-500/30"
                                >
                                    <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
                                        <Icon size={23} className="text-violet-400" />
                                    </div>

                                    <h3 className="text-xl font-semibold">
                                        {t(`values.items.${item.key}.title`)}
                                    </h3>

                                    <p className="mt-4 text-sm leading-7 text-zinc-400">
                                        {t(`values.items.${item.key}.description`)}
                                    </p>

                                    <div className="mt-7 h-px w-12 bg-violet-500/40 transition-all duration-300 group-hover:w-24" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mb-16 max-w-2xl"
                    >
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                            {t("process.eyebrow")}
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {t("process.title")}
                        </h2>

                        <p className="mt-6 leading-8 text-zinc-400">
                            {t("process.description")}
                        </p>
                    </motion.div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.key}
                                initial={{
                                    opacity: 0,
                                    y: reduceMotion ? 0 : 20,
                                }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.55,
                                    delay: reduceMotion ? 0 : index * 0.09,
                                }}
                                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.025] p-7"
                            >
                                <span className="text-5xl font-bold text-violet-500/25">
                                    {step.number}
                                </span>

                                <h3 className="mt-8 text-lg font-semibold">
                                    {t(`process.steps.${step.key}.title`)}
                                </h3>

                                <p className="mt-4 text-sm leading-7 text-zinc-400">
                                    {t(`process.steps.${step.key}.description`)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY */}
            <section className="border-y border-white/[0.06] bg-[#0c0c13] py-20">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-violet-400">
                            <Globe2 size={18} />
                            <span className="text-xs font-semibold uppercase tracking-widest">
                                {t("technology.eyebrow")}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold sm:text-3xl">
                            {t("technology.title")}
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {[
                            "Next.js",
                            "React",
                            "TypeScript",
                            "Node.js",
                            "PostgreSQL",
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-300"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="relative isolate overflow-hidden py-28 sm:py-36">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-1/2 h-[450px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[130px]" />
                </div>

                <div className="relative mx-auto max-w-7xl px-6">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: reduceMotion ? 0 : 35,
                        }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.7,
                        }}
                        className="relative overflow-hidden rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-[#171124] via-[#100e19] to-[#0c0b12] px-7 py-20 text-center shadow-[0_0_100px_rgba(139,92,246,0.07)] sm:px-12"
                    >
                        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-600/15 blur-[80px]" />
                        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[90px]" />

                        <div className="relative">
                            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-violet-300">
                                <Layers3 size={14} />
                                {t("cta.badge")}
                            </div>

                            <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                {t("cta.title")}
                                <span className="mt-3 block bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
                                    {t("cta.highlight")}
                                </span>
                            </h2>

                            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-zinc-400">
                                {t("cta.description")}
                            </p>

                            <Link
                                href="/oferta"
                                className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500"
                            >
                                {t("cta.button")}
                                <ArrowUpRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
