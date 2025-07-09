import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FlipCardReact } from '@flipcard/react';

function MyButton() {
  return (
    <button>我是一个按钮</button>
  );
}
function MyApp() {
  return (
    <div>
      <h1>欢迎来到我的应用</h1>
      <MyButton />
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <MyApp />
    <FlipCardReact>
      <div style={{ width: 200, height: 300, background: '#ccc' }}>React Card</div>
    </FlipCardReact>
  </StrictMode>
);
