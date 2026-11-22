
import type { Metadata } from "next";
import OrderWizard from "@/components/orders/OrderWizard";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Zamówienie | AUREONWEB STUDIO",
    description: "Skonfiguruj i wyceń swoją stronę internetową.",
};

export default function OrderPage() {
    return (
        <>
            <OrderWizard />
            <Footer />
        </>
    );
}
