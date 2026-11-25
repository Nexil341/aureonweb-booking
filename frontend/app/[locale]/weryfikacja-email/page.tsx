import type { Metadata } from "next";
import VerifyEmailContent from "@/components/auth/VerifyEmailContent";

export const metadata: Metadata = {
    title: "Weryfikacja e-mail | AUREONWEB STUDIO",
    description: "Potwierdź adres e-mail swojego konta.",
};

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email } = await searchParams;

    return (
        <VerifyEmailContent
            initialEmail={typeof email === "string" ? email : ""}
        />
    );
}