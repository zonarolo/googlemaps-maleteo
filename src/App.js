import React from 'react';
import './App.css';
import GoogleMapReact from 'google-map-react';
import credentials from "./credentials/credentials";
import useSwr from 'swr';

const fetcher = (...arg) => fetch(...arg).then(response => response.json());
const Marker = ({children}) => children;

function App() {

  // 1) map setup

  // 2) load and format data
  const url =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
  const {data, error} = useSwr(url, fetcher);
  const crimes = data && !error ? data.slice(0, 200) : [];

  // 3) get clusters

  // 4) render map
  return (
    <div className="map">
        <GoogleMapReact bootstrapURLKeys={{ key: credentials.key }}
        defaultCenter={{ lat: 52.6376, lng: -1.135171 }}
        defaultZoom={14}>
          {crimes.map(crime => (
            <Marker key={crime.id} lat={crime.location.latitude} lng={crime.location.longitude}>
              <button className="place-pin">
                <img src="/place.svg" alt="place"/>
              </button>
            </Marker>
          ))}
        </GoogleMapReact>
        <div>Icons made by
          <a href="https://www.flaticon.com/free-icon/place_1452563" title="Kiranshastry"> Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
        </div>
  );
}

export default App;
