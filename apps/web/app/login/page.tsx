"use client";

import { FormEvent, useState } from "react";
import { login } from "@/services/auth";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { refreshUser } = useAuth();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await login(form);
      await refreshUser();
      setMessage(response.message);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}