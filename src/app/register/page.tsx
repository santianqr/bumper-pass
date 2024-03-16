import { RegisterForm } from "@/components/register-form";
import { getServerAuthSession } from "@/server/auth";

export default async function Register() {
  const session = await getServerAuthSession();

  return session ? (
    <main>
      <p className="text-center text-xl">You already have an account.</p>
    </main>
  ) : (
    <RegisterForm />
  );
}
