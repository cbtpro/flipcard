import { useState } from 'react';
import { FlipCardReact } from '@flipcard/react';
import './App.css';

function App() {
  const [trigger, setTrigger] = useState<'hover' | 'click'>('hover');
  const [flipped, setFlipped] = useState(false);
  const [theme, setTheme] = useState('dark');
  return (
    <main className={`playground ${theme}`}>
      <h1>FlipCard / React</h1>
      <p>调整 props，体验悬停或点击翻转。</p>
      <div className="preview">
        <FlipCardReact options={{ trigger, flipped }}>
          <div className="sample-card">FLIPCARD</div>
        </FlipCardReact>
      </div>
      <section className="controls" aria-label="组件 props">
        <label>主题<select value={theme} onChange={event => setTheme(event.target.value)}><option value="dark">深色</option><option value="light">浅色</option></select></label>
        <label>options.trigger<select value={trigger} onChange={event => setTrigger(event.target.value as 'hover' | 'click')}><option value="hover">hover</option><option value="click">click</option></select></label>
        <label><input type="checkbox" checked={flipped} onChange={event => setFlipped(event.target.checked)} /> options.flipped</label>
      </section>
      <pre>{JSON.stringify({ options: { trigger, flipped } }, null, 2)}</pre>
    </main>
  );
}
export default App;
