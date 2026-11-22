import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
    title: "Panel administratora | AUREONWEB STUDIO",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminPage() {
    return <AdminDashboard />;
}