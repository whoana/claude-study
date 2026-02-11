"use client";

import { useState } from "react";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();

      setMessage({
        text: data.message,
        success: data.success,
      });
    } catch {
      setMessage({
        text: "서버 오류가 발생했습니다.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-900"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          로그인
        </h1>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            아이디
          </label>
          <input
            id="username"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            data-testid="username-input"
            placeholder="아이디를 입력하세요"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="password-input"
            placeholder="비밀번호를 입력하세요"
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          data-testid="login-button"
          className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {message && (
          <p
            data-testid="message"
            className={`mt-4 text-center text-sm font-medium ${
              message.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
