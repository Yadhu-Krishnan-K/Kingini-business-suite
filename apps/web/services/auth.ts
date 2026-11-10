import { apiFetch } from "@/lib/api";
import type { AuthUser, LoginData, RegisterData } from "@/types/auth";

export async function register(data: RegisterData) {
  return apiFetch<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginData) {
  return apiFetch<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe() {
  return apiFetch<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>("/auth/me");
}

export async function logout() {
  return apiFetch<{
    success: boolean;
    message: string;
  }>("/auth/logout", {
    method: "POST",
  });
}