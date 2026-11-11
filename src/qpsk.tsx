import React from 'react';
import { createRoot } from 'react-dom/client';
import QpskPage from './QpskPage';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><QpskPage /></React.StrictMode>
);
