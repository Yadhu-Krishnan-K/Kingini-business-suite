import { apiFetch } from "@/lib/api";

export interface CouponResult {
    code: string;
    discount: number;
    discountAmount: number;
    total: number;
}

export async function validateCoupon(
    code: string,
    cartAmount: number,
) {
    return apiFetch<{ data: CouponResult }>("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({
            code,
            cartAmount,
        }),
    });
}