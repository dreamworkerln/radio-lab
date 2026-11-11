import SiteHeader from './components/SiteHeader';
import QpskLab from './components/QpskLab';

const base = import.meta.env.BASE_URL;

export default function QpskPage() {
  return (
    <main className="page">
      <SiteHeader active="constellations" />
      <nav className="breadcrumbs" aria-label="Навигационная цепочка">
        <a href={base}>Главная</a><span aria-hidden="true">/</span>
        <a href={base + 'constellations/'}>Созвездия</a><span aria-hidden="true">/</span><span>QPSK</span>
      </nav>
      <section className="intro">
        <div className="eyebrow">СОЗВЕЗДИЯ / ЭКСПЕРИМЕНТ 01</div>
        <h1>QPSK: сигнал во времени <em>и</em> на фазовой плоскости</h1>
        <p>Передвигайте время, меняйте биты и наблюдайте, как комплексная огибающая одновременно меняется на осциллограммах и диаграмме I/Q.</p>
      </section>
      <QpskLab />
      <footer className="footer"><span>Radio Lab · QPSK</span><a href={base + 'constellations/'}>← Все созвездия</a></footer>
    </main>
  );
}
