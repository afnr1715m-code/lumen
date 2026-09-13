import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form action={loginAction} className="w-full max-w-sm rounded-2xl border border-line bg-bg p-8">
        <h1 className="text-xl font-extrabold text-ink">تسجيل الدخول للوحة التحكم</h1>
        <p className="mt-1 text-sm text-muted">هذي الصفحة خاصة بفريق لومن فقط.</p>

        <label className="mt-6 block text-sm font-semibold text-ink">
          كلمة المرور
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-2 w-full rounded-lg border border-line px-4 py-2.5 text-ink outline-none focus:border-accent"
          />
        </label>

        {error && (
          <p className="mt-3 text-sm text-red-600">كلمة المرور غير صحيحة، حاول مرة أخرى.</p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent"
        >
          دخول
        </button>
      </form>
    </div>
  );
}
