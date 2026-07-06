import { ProfessionView } from "@/components/professions/profession-view";

export default function ProfessionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-black uppercase text-zn-gold">ZProfessions Integration</p>
        <h1 className="text-4xl font-black uppercase">Professions Economy</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">Profession tags, restrictions, market synergies, and economy controls are first-class website data.</p>
      </div>
      <ProfessionView />
    </div>
  );
}
