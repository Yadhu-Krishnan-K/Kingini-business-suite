"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/services/auth";

export default function AccountPage() {

  const { user, clearUser } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      clearUser();
      window.location.href = "/login";
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Logout failed",
      );
    }
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>

      <div className="space-y-3">
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 rounded bg-black px-4 py-3 text-white"
      >
        Logout
      </button>
    </main>
  );
}