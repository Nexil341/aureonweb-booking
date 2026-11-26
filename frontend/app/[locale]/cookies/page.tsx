import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import LegalDocument from "@/components/legal/LegalDocument";
import { getLegalContent } from "@/components/legal/legalContent";

export async function generateMetadata(): Promise<Metadata> {
    const content = getLegalContent("cookies", await getLocale());

    return {
        title: content.metaTitle,
        description: content.metaDescription,
    };
}

export default async function Page() {
    const content = getLegalContent("cookies", await getLocale());

    return <LegalDocument content={content} />;
}
