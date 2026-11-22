import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutContent from "@/components/about/AboutContent";
import Navbar from "@/components/layout/Navbar";


export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("AboutPage");

    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
    };
}

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <AboutContent />
        </>
    );
}