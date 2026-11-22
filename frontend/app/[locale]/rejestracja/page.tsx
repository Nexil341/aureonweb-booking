
import type { Metadata } from "next";
import RegisterContent from "@/components/auth/RegisterContent";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Rejestracja | AUREONWEB STUDIO",
    description: "Utwórz konto klienta w AUREONWEB STUDIO.",
};

export default function RegisterPage() {
    return (
        <>
            <RegisterContent />
            <Footer />
        </>
    );
}
