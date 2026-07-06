import Image from "next/image";
import { RegisterForm } from "@/components/auth/register-form";
import { PublicNav } from "@/components/layout/public-nav";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zn-black text-white">
      <PublicNav />
      <main className="relative grid min-h-[calc(100vh-80px)] place-items-center overflow-hidden px-4 py-12">
        <Image src="/backgrounds/castle-hero.jpg" alt="" fill className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 w-full">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
