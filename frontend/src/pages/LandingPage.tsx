import React from 'react';
import { MaterialIcon } from '../components/MaterialIcon';

interface LandingPageProps {
  onEnterArchive: () => void;
}

const platformPillars = [
  {
    title: 'Evidence Before Noise',
    description:
      'Each policy thread starts from verified source material so debate begins from shared facts, not viral fragments.',
    icon: 'fact_check',
  },
  {
    title: 'Transparent Argument Trails',
    description:
      'Reasoning is structured into claims, rebuttals, and citations, making every shift in position explainable.',
    icon: 'timeline',
  },
  {
    title: 'Civic Collaboration',
    description:
      'Researchers, residents, and institutions can converge on proposals together without flattening disagreement.',
    icon: 'groups',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Select a live policy question',
    detail: 'Pick from active proposals spanning housing, healthcare, education, and energy.',
  },
  {
    step: '02',
    title: 'Review opposing evidence',
    detail: 'Compare support and challenge sources side by side with traceable references.',
  },
  {
    step: '03',
    title: 'Contribute accountable arguments',
    detail: 'Add a claim, include citations, and make your reasoning inspectable by everyone.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterArchive }) => {
  return (
    <div className="min-h-screen text-on-surface bg-[radial-gradient(circle_at_12%_8%,rgba(254,214,91,0.3),transparent_38%),radial-gradient(circle_at_88%_0%,rgba(0,33,71,0.16),transparent_30%),linear-gradient(180deg,#fffdfa_0%,#f7f5f0_40%,#f5f4f0_100%)]">
      <header className="sticky top-0 z-40 border-b border-outline-variant/40 bg-surface/75 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-serif text-2xl tracking-tight text-primary"
          >
            Consonance
          </button>
          <div className="hidden md:flex items-center gap-6 text-sm font-label text-on-surface-variant">
            <a href="#why" className="hover:text-primary transition-colors">
              Why Consonance
            </a>
            <a href="#process" className="hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#join" className="hover:text-primary transition-colors">
              Join Pilot
            </a>
          </div>
          <button
            onClick={onEnterArchive}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label text-sm hover:bg-[#001436] transition-colors focus-visible:focus-ring"
          >
            Explore Policies
          </button>
        </div>
      </header>

      <main>
        <section className="max-w-[1200px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 reveal-soft">
            <MaterialIcon icon="public" size="sm" className="text-primary" />
            <span className="font-label text-xs uppercase tracking-[0.16em] text-primary">Public Deliberation Platform</span>
          </div>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.02] text-primary reveal">
                Turn policy debate into something people can actually reason through.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-surface-variant reveal stagger-1">
                Consonance is a civic workspace where communities compare evidence, map disagreement, and shape better proposals without drowning in outrage loops.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 reveal stagger-2">
                <button
                  onClick={onEnterArchive}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-label font-semibold hover:brightness-95 transition-all focus-visible:focus-ring"
                >
                  Start Exploring
                  <MaterialIcon icon="east" />
                </button>
                <a
                  href="#process"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-outline text-on-surface font-label hover:bg-surface-container-low transition-colors"
                >
                  See the flow
                  <MaterialIcon icon="play_circle" />
                </a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 reveal stagger-3">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">
                  <p className="font-display text-3xl text-primary">1200+</p>
                  <p className="mt-1 text-xs font-label uppercase tracking-[0.14em] text-on-surface-variant">Verified citations</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">
                  <p className="font-display text-3xl text-primary">80+</p>
                  <p className="mt-1 text-xs font-label uppercase tracking-[0.14em] text-on-surface-variant">Active researchers</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/50">
                  <p className="font-display text-3xl text-primary">24</p>
                  <p className="mt-1 text-xs font-label uppercase tracking-[0.14em] text-on-surface-variant">Live policy threads</p>
                </div>
              </div>
            </div>

            <div className="relative reveal stagger-2">
              <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-secondary-container/60 via-surface to-primary/15 blur-2xl" />
              <div className="rounded-2xl border border-outline-variant/50 bg-white/85 backdrop-blur-sm overflow-hidden shadow-[0_25px_60px_-40px_rgba(0,10,30,0.55)]">
                <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between">
                  <span className="font-label text-xs uppercase tracking-[0.16em] text-on-surface-variant">Live Thread</span>
                  <span className="inline-flex items-center gap-1 text-xs font-label text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    <MaterialIcon icon="circle" size="sm" className="text-[10px]" />
                    Active
                  </span>
                </div>
                <div className="p-6 space-y-5">
                  <h2 className="font-headline text-2xl leading-tight text-primary">
                    Should local transport budgets prioritize rail electrification over road expansion?
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl p-3 border border-emerald-200 bg-emerald-50/70">
                      <p className="font-label uppercase text-[11px] tracking-[0.14em] text-emerald-800">Supporting</p>
                      <p className="mt-1 text-emerald-900">62% of cited studies project stronger long-term ROI.</p>
                    </div>
                    <div className="rounded-xl p-3 border border-rose-200 bg-rose-50/70">
                      <p className="font-label uppercase text-[11px] tracking-[0.14em] text-rose-800">Challenging</p>
                      <p className="mt-1 text-rose-900">Regional freight corridors still require targeted road capacity.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 border border-outline-variant/50">
                    <div>
                      <p className="font-label text-xs uppercase tracking-[0.16em] text-on-surface-variant">Consensus Shift</p>
                      <p className="font-serif text-lg text-primary">+9 points this week</p>
                    </div>
                    <MaterialIcon icon="trending_up" className="text-primary" size="2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="border-y border-outline-variant/35 bg-surface-container-low/55">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-16 grid md:grid-cols-3 gap-6">
            {platformPillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className={`rounded-2xl border border-outline-variant/40 bg-surface p-6 reveal stagger-${index + 1}`}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary-container/60 flex items-center justify-center text-primary">
                  <MaterialIcon icon={pillar.icon} />
                </div>
                <h3 className="mt-4 font-headline text-2xl text-primary">{pillar.title}</h3>
                <p className="mt-3 text-on-surface-variant leading-relaxed">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="max-w-[1200px] mx-auto px-6 md:px-10 py-20">
          <div className="max-w-2xl">
            <p className="font-label text-xs uppercase tracking-[0.18em] text-on-surface-variant">Process</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">A clearer path from disagreement to decision.</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {processSteps.map((step, index) => (
              <article
                key={step.step}
                className={`rounded-2xl p-6 bg-gradient-to-b from-white to-surface-container-low border border-outline-variant/40 reveal stagger-${index + 2}`}
              >
                <p className="font-label text-xs tracking-[0.18em] text-on-surface-variant">STEP {step.step}</p>
                <h3 className="mt-3 font-headline text-2xl text-primary leading-tight">{step.title}</h3>
                <p className="mt-3 text-on-surface-variant leading-relaxed">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="join" className="max-w-[1200px] mx-auto px-6 md:px-10 pb-24">
          <div className="rounded-3xl p-8 md:p-12 bg-[linear-gradient(120deg,#00142f_0%,#19355a_55%,#4b6f8c_100%)] text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#fed65b_0,transparent_40%),radial-gradient(circle_at_80%_80%,#ffffff_0,transparent_35%)]" />
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="font-label text-xs uppercase tracking-[0.18em] text-white/70">Pilot Access</p>
                <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
                  Bring your institution into the next round of public reasoning.
                </h2>
                <p className="mt-4 text-white/80 text-lg leading-relaxed">
                  Councils, universities, and civic organizations are joining early to test structured deliberation at real policy speed.
                </p>
              </div>
              <button
                onClick={onEnterArchive}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary-container text-on-secondary-container font-label font-semibold hover:brightness-95 transition-all focus-visible:focus-ring"
              >
                Open Policy Archive
                <MaterialIcon icon="arrow_forward" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
