import React from 'react';
import Home from './pages/Home';
import './app.css';

function App(props) {
  const mdContent = props.mdContent !== undefined ? props.mdContent : '';

  return (
    <Home mdContent={mdContent} mode='init' />
  );
}

export default App;
