
"use client";

import { useState } from "react";

type PayButtonProps = {
    orderId: number;
};

export default function PayButton({ orderId }: PayButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/payments/checkout/${orderId}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok || !data.url) {
                throw new Error(
                    data.error || "Nie udało się rozpocząć płatności"
                );
            }

            window.location.assign(data.url);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Wystąpił błąd"
            );
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
            >
                {loading ? "Przekierowywanie..." : "Zapłać przez Stripe"}
            </button>

            {error && (
                <p className="mt-3 text-sm text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
}
