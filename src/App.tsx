import QpskLab from './components/QpskLab';

export default function App() {
  return (
    <main className="page">
      <header className="masthead">
        <a className="brand" href="#top" aria-label="Radio Lab — на главную">
          <span className="brand-mark" aria-hidden="true">◈</span>
          RADIO<span>LAB</span>
        </a>
        <a className="github-link" href="https://github.com/dreamworkerln/radio-lab" target="_blank" rel="noreferrer">
          Исходный код <span aria-hidden="true">↗</span>
        </a>
      </header>
      <section id="top" className="intro">
        <div className="eyebrow">ИНТЕРАКТИВНАЯ РАДИОЛАБОРАТОРИЯ / ЭКСПЕРИМЕНТ 01</div>
        <h1>QPSK: сигнал во времени <em>и</em> на фазовой плоскости</h1>
        <p>Передвигайте время, меняйте биты и наблюдайте, как комплексная огибающая одновременно меняется на осциллограммах и диаграмме I/Q.</p>
      </section>
      <QpskLab />
      <footer className="footer">
        <span>Radio Lab · Открытый учебный проект</span>
        <span>Время измеряется в символьных интервалах T<sub>s</sub>.</span>
      </footer>
    </main>
  );
}
