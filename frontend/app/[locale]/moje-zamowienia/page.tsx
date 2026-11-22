
import type { Metadata } from "next";
import OrdersDashboard from "@/components/orders/OrdersDashboard";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
    title: "Moje zamówienia | AUREONWEB STUDIO",
    description: "Panel klienta AUREONWEB STUDIO.",
};

export default function MyOrdersPage() {
    return (
        <>
            <Navbar />
            <OrdersDashboard />
            <Footer />
        </>
    );
}
