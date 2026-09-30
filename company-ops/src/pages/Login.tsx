import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { defaultRouteForRole } from "@/lib/rbac";
import { users } from "@/data/roster";
import { ROLE_LABEL } from "@/lib/labels";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";

export default function Login() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleDemoLogin(userId: string) {
    login(userId);
    const user = users.find((u) => u.id === userId)!;
    navigate(defaultRouteForRole(user.role));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Cosmetic-only form — demo accounts below are the real entry points.
    handleDemoLogin("user_manager");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white">
            <Sparkles size={22} />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-ink">نظام إدارة وتشغيل الشركة</h1>
            <p className="mt-1 text-sm text-muted">تسجيل الدخول للمتابعة</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
          <div className="relative">
            <User size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              type="text"
              placeholder="رقم الجوال أو البريد الإلكتروني"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ps-9"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-[var(--color-accent)]"
            />
            تذكرني
          </label>
          <Button type="submit" className="w-full">
            تسجيل الدخول
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-line p-4">
          <p className="mb-3 text-center text-xs font-semibold text-muted">حسابات تجريبية للعرض</p>
          <div className="space-y-2">
            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleDemoLogin(u.id)}
                className="flex w-full items-center justify-between rounded-lg border border-line bg-surface px-3 py-2.5 text-start text-sm hover:border-accent"
              >
                <span className="font-semibold text-ink">{u.name}</span>
                <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                  {ROLE_LABEL[u.role]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
