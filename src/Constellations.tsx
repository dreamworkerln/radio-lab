import SiteHeader from './components/SiteHeader';

const base = import.meta.env.BASE_URL;
function QpskPreview() {
  const dots = [[75,30],[135,30],[75,90],[135,90]];
  return (
    <svg className="preview-svg" viewBox="0 0 210 120" role="img" aria-label="Четыре точки созвездия QPSK">
      <path d="M105 8V112M22 60H188" stroke="#45617d" strokeWidth="1.4" />
      <circle cx="105" cy="60" r="43" fill="none" stroke="#45617d" strokeDasharray="4 5" />
      {dots.map(([x,y],index)=><circle key={index} cx={x} cy={y} r="6" fill="#63a0ff" />)}
    </svg>
  );
}
export default function Constellations() {
  return (
    <main className="page">
      <SiteHeader active="constellations" />
      <nav className="breadcrumbs" aria-label="Навигационная цепочка">
        <a href={base}>Главная</a><span aria-hidden="true">/</span><span>Созвездия</span>
      </nav>
      <section className="intro section-intro">
        <div className="eyebrow">РАЗДЕЛ 01 / ЦИФРОВАЯ МОДУЛЯЦИЯ</div>
        <h1>Созвездия <em>I/Q</em></h1>
        <p>Диаграмма созвездия показывает символы на комплексной плоскости. Здесь собраны интерактивные модели: от расположения точек до изменений I(t) и Q(t) во времени.</p>
      </section>
      <section className="catalog-section" aria-labelledby="models-heading">
        <div className="section-heading"><h2 id="models-heading">Симуляторы</h2><span className="section-count">1 доступен</span></div>
        <div className="model-grid">
          <a href={base + 'constellations/qpsk/'} className="model-card model-card-live">
            <div className="model-preview"><QpskPreview/></div>
            <div className="model-card-content">
              <span className="card-status ready">Работает</span>
              <h3>QPSK — комплексная огибающая</h3>
              <p>Четыре символьных состояния, редактирование битов, временные графики и импульсное формирование Raised Cosine.</p>
              <span className="category-link">Запустить симулятор →</span>
            </div>
          </a>
          <article className="model-card model-card-future">
            <div className="model-preview model-preview-empty" aria-hidden="true">••</div>
            <div className="model-card-content"><span className="card-status planned">В планах</span><h3>BPSK</h3><p>Два символа и поворот фазы на 180°.</p></div>
          </article>
          <article className="model-card model-card-future">
            <div className="model-preview model-preview-empty" aria-hidden="true">✦</div>
            <div className="model-card-content"><span className="card-status planned">В планах</span><h3>QAM</h3><p>Амплитуда, фаза и плотные решётки созвездий.</p></div>
          </article>
        </div>
      </section>
      <footer className="footer"><span>Radio Lab · Созвездия</span><a href={base}>Вернуться в каталог</a></footer>
    </main>
  );
}
