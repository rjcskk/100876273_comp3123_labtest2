import React from 'react';
import Weather from './components/Weather';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Weather <span className="forecast-heading">Forecast</span></h1>
      <Weather />
    </div>
  );
}

export default App;
