import React from 'react';
import { createRoot } from 'react-dom/client';
import Constellations from './Constellations';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Constellations /></React.StrictMode>
);
