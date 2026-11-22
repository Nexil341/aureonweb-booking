
"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import {
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Code2,
    Globe2,
    Mail,
    MessageSquare,
    Send,
    ShieldCheck,
    Sparkles,
} from "lucide-react";


import Reveal from "@/components/ui/Reveal";

type ContactForm = {
    name: string;
    email: string;
    projectType: string;
    budget: string;
    message: string;
    website: string;
};

const initialForm: ContactForm = {
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
    website: "",
};

const projectTypes = [
    "website",
    "webapp",
    "automation",
    "other",
] as const;

const budgets = [
    "under500",
    "500to1500",
    "1500to5000",
    "over5000",
    "unknown",
] as const;

export default function ContactContent() {
    const t = useTranslations("ContactPage");
    const reducedMotion = useReducedMotion();

    const [form, setForm] = useState<ContactForm>(initialForm);
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [error, setError] = useState("");

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-[#11111b] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15";

    function updateField(field: keyof ContactForm, value: string) {
        setForm((previous) => ({ ...previous, [field]: value }));

        if (status === "error") {
            setStatus("idle");
            setError("");
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (status === "loading") return;

        if (
            form.name.trim().length < 2 ||
            form.message.trim().length < 10 ||
            !form.projectType
        ) {
            setStatus("error");
            setError(t("form.validation"));
            return;
        }

        setStatus("loading");
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                throw new Error("API_URL_NOT_CONFIGURED");
            }

            const response = await fetch(
                `${apiUrl.replace(/\/$/, "")}/api/contact`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error("RATE_LIMIT");
                }

                if (response.status === 400) {
                    throw new Error("VALIDATION");
                }

                throw new Error(result?.message || "SERVER_ERROR");
            }

            setForm(initialForm);
            setStatus("success");
        } catch (err) {
            const code = err instanceof Error ? err.message : "";

            setStatus("error");
            setError(
                code === "RATE_LIMIT"
                    ? t("form.rateLimit")
                    : code === "VALIDATION"
                        ? t("form.validation")
                        : t("form.error")
            );
        }
    }

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#08080d] text-white">

            {/* HERO */}
            <section className="relative isolate overflow-hidden px-6 pb-20 pt-32 md:pt-40">
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[130px]" />
                    <div className="absolute right-0 top-44 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />
                </div>

                <Reveal className="mx-auto max-w-5xl text-center">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-xs font-semibold tracking-widest text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        AUREONWEB STUDIO
                    </div>

                    <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.045em] sm:text-6xl md:text-7xl">
                        {t("hero.title")}
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                            {t("hero.highlight")}
                        </span>
                    </h1>

                    <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
                        {t("hero.description")}
                    </p>
                </Reveal>
            </section>

            {/* CONTACT CONTENT */}
            <section className="px-6 pb-28">
                <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    {/* LEFT SIDE */}
                    <div className="space-y-6">
                        <Reveal direction="left">
                            <div className="rounded-3xl border border-white/10 bg-[#0d0d16] p-8 md:p-10">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                                    <MessageSquare className="h-7 w-7 text-violet-400" />
                                </div>

                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
                                    {t("info.eyebrow")}
                                </p>

                                <h2 className="text-3xl font-bold tracking-tight">
                                    {t("info.title")}
                                </h2>

                                <p className="mt-5 text-sm leading-8 text-zinc-400">
                                    {t("info.description")}
                                </p>

                                <div className="mt-8 space-y-6 border-t border-white/10 pt-8">
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                            <Globe2 className="h-5 w-5 text-violet-400" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {t("info.onlineTitle")}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-zinc-400">
                                                {t("info.onlineDescription")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                            <Clock3 className="h-5 w-5 text-violet-400" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {t("info.responseTitle")}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-zinc-400">
                                                {t("info.responseDescription")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                                            <ShieldCheck className="h-5 w-5 text-violet-400" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {t("info.securityTitle")}
                                            </h3>
                                            <p className="mt-1 text-sm leading-6 text-zinc-400">
                                                {t("info.securityDescription")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        <Reveal direction="left" delay={0.12}>
                            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-[#101018] p-8">
                                <Code2 className="mb-5 h-7 w-7 text-violet-400" />

                                <h3 className="text-xl font-bold">
                                    {t("custom.title")}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-zinc-400">
                                    {t("custom.description")}
                                </p>

                                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-violet-300">
                                    {t("custom.action")}
                                    <ArrowUpRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* FORM */}
                    <Reveal direction="right">
                        <div className="rounded-3xl border border-white/10 bg-[#0d0d16] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.2)] sm:p-8 md:p-10">
                            <div className="mb-9 flex items-start justify-between gap-4">
                                <div>
                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400">
                                        {t("form.eyebrow")}
                                    </p>

                                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                                        {t("form.title")}
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                                        {t("form.description")}
                                    </p>
                                </div>

                                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 sm:flex">
                                    <Mail className="h-6 w-6 text-violet-400" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Honeypot: hidden from normal visitors */}
                                <div
                                    aria-hidden="true"
                                    className="absolute -left-[10000px] h-px w-px overflow-hidden"
                                >
                                    <label htmlFor="contact-website">
                                        Website
                                    </label>
                                    <input
                                        id="contact-website"
                                        name="website"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={form.website}
                                        onChange={(e) =>
                                            updateField("website", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="mb-2 block text-sm font-medium text-zinc-200"
                                        >
                                            {t("form.name")}
                                        </label>

                                        <input
                                            id="contact-name"
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            required
                                            minLength={2}
                                            maxLength={100}
                                            value={form.name}
                                            onChange={(e) =>
                                                updateField("name", e.target.value)
                                            }
                                            placeholder={t("form.namePlaceholder")}
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="mb-2 block text-sm font-medium text-zinc-200"
                                        >
                                            {t("form.email")}
                                        </label>

                                        <input
                                            id="contact-email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            required
                                            maxLength={254}
                                            value={form.email}
                                            onChange={(e) =>
                                                updateField("email", e.target.value)
                                            }
                                            placeholder={t("form.emailPlaceholder")}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label
                                            htmlFor="contact-project"
                                            className="mb-2 block text-sm font-medium text-zinc-200"
                                        >
                                            {t("form.projectType")}
                                        </label>

                                        <select
                                            id="contact-project"
                                            required
                                            value={form.projectType}
                                            onChange={(e) =>
                                                updateField("projectType", e.target.value)
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                {t("form.select")}
                                            </option>

                                            {projectTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {t(`form.projectTypes.${type}`)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contact-budget"
                                            className="mb-2 block text-sm font-medium text-zinc-200"
                                        >
                                            {t("form.budget")}
                                        </label>

                                        <select
                                            id="contact-budget"
                                            value={form.budget}
                                            onChange={(e) =>
                                                updateField("budget", e.target.value)
                                            }
                                            className={inputClass}
                                        >
                                            <option value="">
                                                {t("form.selectOptional")}
                                            </option>

                                            {budgets.map((budget) => (
                                                <option key={budget} value={budget}>
                                                    {t(`form.budgets.${budget}`)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-message"
                                        className="mb-2 block text-sm font-medium text-zinc-200"
                                    >
                                        {t("form.message")}
                                    </label>

                                    <textarea
                                        id="contact-message"
                                        required
                                        minLength={10}
                                        maxLength={5000}
                                        rows={6}
                                        value={form.message}
                                        onChange={(e) =>
                                            updateField("message", e.target.value)
                                        }
                                        placeholder={t("form.messagePlaceholder")}
                                        className={`${inputClass} resize-y`}
                                    />
                                </div>

                                {status === "success" && (
                                    <div
                                        role="status"
                                        className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                                    >
                                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                                        {t("form.success")}
                                    </div>
                                )}

                                {status === "error" && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300"
                                    >
                                        {error}
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    whileHover={
                                        reducedMotion || status === "loading"
                                            ? undefined
                                            : { y: -3 }
                                    }
                                    whileTap={
                                        reducedMotion || status === "loading"
                                            ? undefined
                                            : { scale: 0.98 }
                                    }
                                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-violet-600 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {status === "loading" ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            {t("form.sending")}
                                        </>
                                    ) : (
                                        <>
                                            {t("form.submit")}
                                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </motion.button>

                                <p className="text-center text-xs leading-6 text-zinc-500">
                                    {t("form.privacy")}
                                </p>
                            </form>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="border-t border-white/10 bg-[#0c0c14] px-6 py-20">
                <Reveal className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        {t("bottom.title")}
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl leading-8 text-zinc-400">
                        {t("bottom.description")}
                    </p>

                    <a
                        href="#top"
                        onClick={(event) => {
                            event.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: reducedMotion ? "instant" : "smooth",
                            });
                        }}
                        className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
                    >
                        {t("bottom.back")}
                        <ArrowRight className="h-4 w-4" />
                    </a>
                </Reveal>
            </section>

        </main>
    );
}
