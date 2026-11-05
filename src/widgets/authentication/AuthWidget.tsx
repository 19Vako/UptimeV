import { AuthForm } from '@/features/auth/ui/AuthForm';

export function AuthWidget({ mode }: { mode: 'login' | 'register' }) {
  return <AuthForm mode={mode} />;
}
