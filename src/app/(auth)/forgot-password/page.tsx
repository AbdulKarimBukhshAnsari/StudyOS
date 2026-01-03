import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      svgPath="/assets/auth/login.svg"
      title="FORGOT PASSWORD"
      subtitle="Enter your email to reset your password"
    >
      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="pl-10"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Send Reset Link
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

