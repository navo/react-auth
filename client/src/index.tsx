import React from 'react';
import App from './App';
import Context from './Pages/Context';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById("root") as HTMLElement);


root.render(
  <React.StrictMode>
    <Context>
    <App />
    </Context>
  </React.StrictMode>
);


