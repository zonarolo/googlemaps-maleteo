import React from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import credentials from "./credentials/credentials";

function App() {
  return (
    <div className="App">
        <GoogleMapReact bootstrapURLKeys={{ key: credentials.key }}
        defaultCenter={{lat: 54.434, lng: -1.2323}}
        defaultZoom={10}>

        </GoogleMapReact>
    </div>
  );
}

export default App;
