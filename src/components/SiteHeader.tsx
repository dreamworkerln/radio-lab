export default function SiteHeader({ active }: { active: 'home' | 'constellations' }) {
  const base = import.meta.env.BASE_URL;
  return (
    <header className="masthead">
      <a className="brand" href={base} aria-label="Radio Lab — главная">
        <span className="brand-mark" aria-hidden="true">◈</span>
        RADIO<span>LAB</span>
      </a>
      <nav className="top-nav" aria-label="Основное меню">
        <a href={base} aria-current={active === 'home' ? 'page' : undefined}>Главная</a>
        <a href={base + 'constellations/'} aria-current={active === 'constellations' ? 'page' : undefined}>Созвездия</a>
        <a className="github-link" href="https://github.com/dreamworkerln/radio-lab" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}
