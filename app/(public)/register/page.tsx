import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { PublicNav } from "@/components/layout/public-nav";
import { getCurrentUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zn-black text-zn-parchment">
      <PublicNav />
      <main className="realm-field relative grid min-h-[calc(100vh-80px)] place-items-center overflow-hidden px-4 py-12">
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-8 text-center">
            <span className="banner-tab mx-auto">Take the Oath</span>
            <h1 className="mt-4 font-display text-4xl tracking-wide md:text-5xl">Join the Realm</h1>
            <div className="crest-rule mx-auto mt-4 w-32" />
          </div>
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
