
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Globe2,
  Layers3,
  Sparkles,
  Rocket,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";

const services = [
  { icon: Globe2, number: "01", key: "websites" },
  { icon: Code2, number: "02", key: "webapps" },
  { icon: Layers3, number: "03", key: "digital" },
] as const;

const advantages = [
  { icon: Rocket, key: "technology" },
  { icon: ShieldCheck, key: "quality" },
  { icon: Zap, key: "individual" },
] as const;

const steps = [
  { number: "01", key: "choose" },
  { number: "02", key: "describe" },
  { number: "03", key: "development" },
  { number: "04", key: "delivery" },
] as const;

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08080d] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate overflow-hidden px-6 pb-28 pt-28 md:pb-36 md:pt-40">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-[140px]" />
          <div className="absolute -right-40 top-60 h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
          <div className="absolute -left-40 top-80 h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        <Reveal className="relative mx-auto max-w-6xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-5 py-2.5 text-xs font-medium tracking-wider text-violet-300">
            <Sparkles className="h-4 w-4" />
            DIGITAL EXPERIENCE STUDIO
          </div>

          <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-8xl">
            {t("hero.title")}
            <br />
            {t("hero.subtitle")}{" "}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("hero.highlight")}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-zinc-400 md:text-lg">
            {t("hero.description")}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/oferta"
              className="group inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-violet-600 px-7 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:shadow-violet-600/40"
            >
              {t("hero.offer")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/#contact"
              className="group inline-flex h-13 items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-7 text-sm font-medium text-white transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-white/10"
            >
              {t("hero.contact")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-24 grid gap-5 border-t border-white/10 pt-9 text-left md:grid-cols-3">
            {(["design", "performance", "approach"] as const).map(
              (key, index) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-violet-400">
                    0{index + 1}
                  </span>
                  <span className="text-sm text-zinc-300">
                    {t(`hero.features.${key}`)}
                  </span>
                </div>
              )
            )}
          </div>
        </Reveal>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="border-t border-white/10 bg-[#0c0c14] px-6 py-28"
      >
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-14 max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              {t("services.label")}
            </p>

            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              {t("services.title")}{" "}
              <span className="text-violet-400">
                {t("services.highlight")}
              </span>
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-zinc-400">
              {t("services.description")}
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal
                  key={service.number}
                  delay={index * 0.12}
                  className="h-full"
                >
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-8 transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-violet-500/5 hover:shadow-[0_15px_50px_rgba(124,58,237,0.08)]">
                    <div className="mb-12 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 transition duration-300 group-hover:scale-110 group-hover:bg-violet-500/20">
                        <Icon className="h-7 w-7 text-violet-400" />
                      </div>

                      <span className="text-sm text-zinc-600">
                        {service.number}
                      </span>
                    </div>

                    <h3 className="mb-4 text-xl font-semibold">
                      {t(`services.items.${service.key}.title`)}
                    </h3>

                    <p className="min-h-24 text-sm leading-7 text-zinc-400">
                      {t(`services.items.${service.key}.description`)}
                    </p>

                    <Link
                      href="/oferta"
                      className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
                    >
                      {t("services.more")}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <Reveal direction="left">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              {t("about.label")}
            </p>

            <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {t("about.title")}
              <br />
              <span className="text-violet-400">
                {t("about.highlight")}
              </span>
            </h2>

            <p className="mt-7 max-w-xl leading-8 text-zinc-400">
              {t("about.description1")}
            </p>

            <p className="mt-5 max-w-xl leading-8 text-zinc-400">
              {t("about.description2")}
            </p>

            <Link
              href="/oferta"
              className="group mt-8 inline-flex items-center gap-2 font-medium text-violet-400 transition hover:text-violet-300"
            >
              {t("about.more")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="space-y-4">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;

              return (
                <Reveal
                  key={advantage.key}
                  direction="right"
                  delay={index * 0.1}
                >
                  <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-violet-500/5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-violet-400" />
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">
                        {t(`about.advantages.${advantage.key}.title`)}
                      </h3>

                      <p className="text-sm leading-7 text-zinc-400">
                        {t(`about.advantages.${advantage.key}.description`)}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y border-white/10 bg-[#0c0c14] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-14 text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              {t("process.label")}
            </p>

            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              {t("process.title")}
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-zinc-400">
              {t("process.description")}
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 0.1}
                className="h-full"
              >
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-500/30">
                  <span className="text-4xl font-bold text-violet-500/60">
                    {step.number}
                  </span>

                  <h3 className="mt-8 text-lg font-semibold">
                    {t(`process.steps.${step.key}.title`)}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-zinc-400">
                    {t(`process.steps.${step.key}.description`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="scroll-mt-20 px-6 py-28">
        <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-950/70 via-[#151020] to-[#0b0b12] px-8 py-20 text-center md:px-16">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />

          <div className="relative">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
              <Sparkles className="h-4 w-4" />
              {t("cta.label")}
            </div>

            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              {t("cta.title")}
              <br />
              <span className="text-violet-400">
                {t("cta.highlight")}
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl leading-8 text-zinc-400">
              {t("cta.description")}
            </p>

            <Link
              href="/oferta"
              className="group mt-9 inline-flex h-13 items-center justify-center gap-3 rounded-xl bg-violet-600 px-8 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:shadow-[0_12px_40px_rgba(124,58,237,0.3)]"
            >
              {t("cta.button")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
