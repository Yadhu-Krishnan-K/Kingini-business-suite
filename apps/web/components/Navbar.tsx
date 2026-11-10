"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { logout } from "@/services/auth";

export default function Navbar() {
  const { user, loading, clearUser } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      clearUser();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-bold">
        Kingini
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/">Products</Link>

        {!loading && !user && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}

        {!loading && user && (
          <>
            <Link href="/account">Account</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/wishlist">Wishlist</Link>
            
            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}