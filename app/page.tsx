const pillars = [
  { title: "Discover", text: "Find the right vehicle with structured, trusted data." },
  { title: "Buy & Sell", text: "Connect through safer listings and transparent tools." },
  { title: "Own", text: "Build your digital garage and manage the full lifecycle." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-brand-red">South Africa&apos;s digital garage</p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-brand-graphite sm:text-6xl">
            The Automotive <span className="text-brand-red">Operating System.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-muted sm:text-xl">
            A modern, trusted ecosystem to discover, buy, sell, and own vehicles with confidence.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-lg bg-brand-red px-6 py-3 font-semibold text-white shadow-card transition hover:bg-brand-red-dark">Explore vehicles</button>
            <button className="rounded-lg border border-brand-silver bg-surface-white px-6 py-3 font-semibold text-brand-graphite shadow-card transition hover:shadow-card-hover">List your vehicle</button>
          </div>
        </div>
        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-xl bg-surface-white p-6 shadow-card">
              <h2 className="text-xl font-bold tracking-tight">{pillar.title}</h2>
              <p className="mt-2 leading-relaxed text-neutral-muted">{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
