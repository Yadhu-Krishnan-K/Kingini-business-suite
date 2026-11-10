"use client";

import { FormEvent, useState } from "react";
import { register } from "@/services/auth";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      const response = await register(form);
      setMessage(response.message);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full rounded border p-3"
        />

        <input
          name="lastName"
          placeholder="Last name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full rounded border p-3"
        />

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
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {message && <p className="text-sm">{message}</p>}
      </form>
    </main>
  );
}