import Link from 'next/link';
import Image from 'next/image';
import { getDb } from '@/db';
export const runtime = 'edge';
import { Sparkles, Users } from 'lucide-react';
import SuccessStoryCard from '@/components/SuccessStoryCard';
import EmployeeCard from '@/components/EmployeeCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = getDb();
  const [latestAnnouncement, featuredParts, allStories, allEmployees] = await Promise.all([
    db.query.announcements.findFirst({
      where: (announcements: any, { eq }: any) => eq(announcements.active, true),
      orderBy: (announcements: any, { desc }: any) => [desc(announcements.createdAt)],
    }),
    db.query.parts.findMany({
      limit: 3,
      orderBy: (parts: any, { desc }: any) => [desc(parts.createdAt)],
    }),
    db.query.successStories.findMany({
      orderBy: (successStories: any, { desc }: any) => [desc(successStories.createdAt)],
    }),
    db.query.employees.findMany({
      orderBy: (employees: any, { desc }: any) => [desc(employees.createdAt)],
    })
  ]);

  const announcementText = latestAnnouncement?.text || "Experience the synergy of Hyundai's advanced technology and Bhutanese hospitality.";

  return (
    <div className="pb-32 overflow-hidden">
      {/* Hero Section - Full Width Background Area */}
      <section className="relative">
        {/* Abstract background glow */}
        <div className="absolute -top-40 -left-40 w-full max-w-2xl h-[800px] bg-hyundai-accent/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="py-20">
          <div className="flex flex-col lg:flex-row items-center gap-20 relative z-10">
            <div className="flex-1 space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
                  <span className="w-2 h-2 rounded-full bg-hyundai-accent animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Serving the Kingdom Since 1999</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black leading-[1.1] drop-shadow-2xl italic tracking-tighter text-white">
                  BHUTAN HYUNDAI<br />
                  <span className="accent-text brightness-125">MOTORS</span>
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-hyundai-accent to-transparent rounded-full"></div>
              </div>

              <p className="text-xl md:text-2xl opacity-80 max-w-2xl leading-relaxed font-medium">
                Experience world-class automotive electrical solutions and premium genuine parts.
                Driven by innovation, committed to your journey&apos;s safety and performance.
              </p>

              <div className="flex flex-wrap gap-6 pt-6">
                <Link href="/book" className="btn-primary text-sm px-12 py-5 !tracking-[0.2em] shadow-2xl shadow-hyundai-blue/40">Book Service</Link>
                <Link href="/inventory" className="border-2 border-white/10 bg-white/5 backdrop-blur-2xl hover:bg-white hover:text-hyundai-blue px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all group overflow-hidden relative">
                  <span className="relative z-10 font-bold">Inventory</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-[500px] mx-auto relative group">
              <div className="absolute inset-0 bg-hyundai-accent/5 blur-[80px] rounded-full scale-125 pointer-events-none group-hover:bg-hyundai-accent/10 transition-colors duration-1000"></div>
              <div className="glass-card !p-8 md:!p-12 relative z-10 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-hyundai-accent/30">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-hyundai-accent/50 to-transparent"></div>

                <div className="flex flex-col items-center space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-hyundai-accent/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                      <Image
                        src="/images/hyundai_logo_spinner.png"
                        alt="Hyundai Logo"
                        width={90}
                        height={90}
                        priority
                        className="drop-shadow-[0_0_15px_rgba(0,114,188,0.4)] object-contain invert-[0.1]"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-px w-8 bg-white/10"></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Announcement</span>
                      <div className="h-px w-8 bg-white/10"></div>
                    </div>

                    <div className="space-y-6 pt-2">
                      <div className="inline-flex items-center gap-2 bg-[#ffab40]/10 text-[#ffab40] text-[9px] uppercase px-4 py-1.5 rounded-full font-black tracking-[.2em] border border-[#ffab40]/20 shadow-[0_0_15px_rgba(255,171,64,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffab40] animate-pulse outline outline-4 outline-[#ffab40]/20"></span>
                        Latest Announcement
                      </div>
                      <p className="text-xl md:text-2xl font-bold italic leading-relaxed text-white/90 px-2 drop-shadow-sm">
                        &quot;{announcementText}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-hyundai-accent/5 rounded-full blur-2xl opacity-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parts Section - Localized Container */}
      <section className="space-y-12 py-16">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-hyundai-accent/10 border border-hyundai-accent/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-hyundai-accent">Genuine Inventory</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Genuine <span className="accent-text brightness-125">Parts</span>
          </h2>
          <p className="text-sm text-white/40 font-bold tracking-wide max-w-2xl mx-auto leading-relaxed italic">
            &quot;Engineered for performance and longevity,<br /> maintaining the peak condition of your Bhutan Hyundai vehicle.&quot;
          </p>

          <Link href="/inventory" className="md:hidden inline-flex text-xs font-black uppercase tracking-[0.3em] text-white/40 hover:text-hyundai-accent transition-colors items-center gap-3 group px-6 py-3 bg-white/5 rounded-full border border-white/5 hover:border-hyundai-accent/20">
            View Catalog
            <div className="w-8 h-px bg-white/20 group-hover:w-12 group-hover:bg-hyundai-accent transition-all duration-500"></div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {featuredParts.map((part: any, idx: number) => (
            <Link
              key={part.id}
              href={`/inventory?id=${part.id}`}
              className="glass-card flex flex-col hover:border-hyundai-accent/40 transition-all duration-700 group relative overflow-hidden"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="aspect-[4/3] bg-white/[0.02] relative p-8">
                {part.image && (
                  <Image
                    src={part.image}
                    alt={part.name}
                    fill
                    className="object-contain p-8 group-hover:scale-110 transition-transform duration-[1.5s]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1425] to-transparent opacity-60"></div>
              </div>
              <div className="p-8 space-y-4 flex-grow">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-hyundai-accent transition-colors">
                    {part.name}
                  </h4>
                  <span className="text-hyundai-accent font-black text-lg italic">Nu.{part.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest line-clamp-2">
                  {part.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="relative py-16">
        {/* Section Bleed Background */}
        <div className="absolute inset-x-0 h-full bg-blue-500/[0.02] border-y border-white/5 pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] -ml-40"></div>

        <div className="space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-hyundai-accent/10 border border-hyundai-accent/20 rounded-full">
              <Sparkles className="w-4 h-4 text-hyundai-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-hyundai-accent">Corporate Milestones</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
              Celebrating <span className="accent-text brightness-125">Excellence</span>
            </h2>
            <p className="text-sm text-white/40 font-bold tracking-wide max-w-2xl mx-auto leading-relaxed italic">
              &quot;Spotlighting the moments that define our journey<br /> and commitment to automotive perfection.&quot;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {allStories.map((story: any) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
            {allStories.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl opacity-50 italic text-sm">
                New milestones are currently being documented...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Team Showcase Section */}
      <section className="space-y-12 py-16 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>

        <div className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-hyundai-accent/10 border border-hyundai-accent/20 rounded-full">
            <Users className="w-4 h-4 text-hyundai-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-hyundai-accent">Our Expertise Engine</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Meet Our <span className="accent-text brightness-125">Expert Team</span>
          </h2>
          <p className="text-sm text-white/40 font-bold tracking-wide max-w-2xl mx-auto leading-relaxed italic text-balance">
            &quot;Highly skilled professionals dedicated to maintaining<br /> the highest standards of automotive excellence.&quot;
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {allEmployees.map((employee: any) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
          {allEmployees.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl opacity-50 italic text-sm">
              Our team roster is currently being finalized...
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
