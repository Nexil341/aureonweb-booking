
import type { Metadata } from "next";
import ContactContent from "@/components/contact/ContactContent";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
    title: "Kontakt | AUREONWEB STUDIO",
    description:
        "Skontaktuj się z AUREONWEB STUDIO i opowiedz nam o swoim projekcie.",
};

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <ContactContent />
            <Footer />
        </>
    );
}
