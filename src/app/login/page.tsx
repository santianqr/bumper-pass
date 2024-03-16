import { LoginForm } from "@/components/login-form";
import { getServerAuthSession } from "@/server/auth";

export default async function Login() {
  const session = await getServerAuthSession();
  return session ? (
    <main>
      <p className="text-center text-xl">You already have logged.</p>
    </main>
  ) : (
    <LoginForm />
  );
}
