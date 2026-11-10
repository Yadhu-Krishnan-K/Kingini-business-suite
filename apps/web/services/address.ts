import { apiFetch } from "@/lib/api";

import type { Address } from "@/types/address";

export async function getAddresses() {
  return apiFetch<{ data: Address[] }>("/addresses");
}