import SiteHeader from './components/SiteHeader';

const base = import.meta.env.BASE_URL;

export default function App() {
  return (
    <main className="page">
      <SiteHeader active="home" />
      <section className="intro home-intro">
        <div className="eyebrow">RADIO LAB / ИНТЕРАКТИВНЫЕ ЭКСПЕРИМЕНТЫ</div>
        <h1>Радиосвязь, которую можно <em>исследовать</em></h1>
        <p>Меняйте параметры, запускайте моделирование и наблюдайте за сигналами — от битов и фазовых созвездий до радиоканала. Каждая демонстрация живёт в своём разделе.</p>
      </section>
      <section aria-labelledby="sections-heading" className="catalog-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">КАТАЛОГ</div>
            <h2 id="sections-heading">Разделы лаборатории</h2>
          </div>
          <span className="section-count">1 активный раздел</span>
        </div>
        <div className="category-grid">
          <a className="category-card category-card-active" href={base + 'constellations/'}>
            <div className="category-top"><span className="category-icon">◈</span><span className="card-status ready">Доступно</span></div>
            <svg className="category-visual" viewBox="0 0 300 118" role="img" aria-label="Пример диаграммы созвездия">
              <path d="M150 7V111M38 59H262" stroke="#28445f" strokeWidth="1.5" />
              <circle cx="150" cy="59" r="46" fill="none" stroke="#28445f" strokeDasharray="3 5"/>
              {[[117,26],[183,26],[117,92],[183,92]].map(([x,y],n)=><circle key={n} cx={x} cy={y} r="8" fill="#4e94ff" stroke="#93bcff" strokeWidth="2" />)}
            </svg>
            <h3>Созвездия и модуляция</h3>
            <p>Фазовая плоскость I/Q, символы и их временное представление. Начнём с QPSK.</p>
            <span className="category-link">Открыть раздел <span aria-hidden="true">→</span></span>
          </a>
          <article className="category-card category-card-planned">
            <div className="category-top"><span className="category-icon">∿</span><span className="card-status planned">В планах</span></div>
            <div className="category-placeholder" aria-hidden="true">∿∿∿∿</div>
            <h3>Сигналы и спектры</h3>
            <p>Временные формы, спектры, фильтры и их влияние на передачу сигнала.</p>
          </article>
          <article className="category-card category-card-planned">
            <div className="category-top"><span className="category-icon">⌁</span><span className="card-status planned">В планах</span></div>
            <div className="category-placeholder" aria-hidden="true">⌁⌁⌁</div>
            <h3>LoRa PHY</h3>
            <p>Чирпы, ширина полосы, spreading factor и демодуляция.</p>
          </article>
        </div>
      </section>
      <footer className="footer"><span>Radio Lab · Открытый учебный проект</span><span>Эксперименты работают в браузере</span></footer>
    </main>
  );
}
