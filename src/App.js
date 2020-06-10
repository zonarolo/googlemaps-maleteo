import React, {useRef, useState} from "react";
import './App.css';
import GoogleMapReact from 'google-map-react';
import credentials from "./credentials/credentials";
import useSwr from 'swr';
import useSupercluster from "use-supercluster";

const fetcher = (...arg) => fetch(...arg).then(response => response.json());
const Marker = ({children}) => children;

function App() {

  // 1) map setup
  const [ zoom, setZoom ] = useState(10);
  const [bounds, setBounds] = useState(null);
  const mapRef = useRef();

  // 2) load and format data
  const url =
    "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
  const {data, error} = useSwr(url, fetcher);
  const crimes = data && !error ? data : [];
  const points = crimes.map(crime => ({
    "type": "Feature",
    "properties": {
      "cluster": false,
      "crimeId": crime.id,
      "category": crime.category
    },
    "geometry": { "type": "Point", "coordinates": [ parseFloat(crime.location.longitude), parseFloat(crime.location.latitude) ] }
  }));

  // 3) get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });
  // console.log( clusters ); // Here you can see the groups

  // 4) render map
  return (
    <div className="map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: credentials.key }}
          defaultCenter={{ lat: 52.6376, lng: -1.135171 }}
          defaultZoom={14}
          onChange={({zoom, bounds}) => {
            setZoom(zoom);
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
              bounds.nw.lat
            ]);
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
          }}
        >
          {clusters.map(cluster => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster} = cluster.properties;

            if (isCluster) {
              return (
                <Marker
                  key={cluster.id}
                  lat={latitude}
                  lng={longitude}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${ 10 + ( cluster.properties.point_count / points.length ) * 30 }px`,
                      height: `${ 10 + ( cluster.properties.point_count / points.length ) * 30 }px`
                    }}
                    onClick={ () => {
                      const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                      mapRef.current.setZoom(expansionZoom);
                      mapRef.current.panTo({ lat: latitude, lng: longitude });
                    }}
                  >
                    {cluster.properties.point_count}
                  </div>
                </Marker>
              );
            }

            return (
              <Marker
                key={cluster.properties.crimeID}
                lat={latitude}
                lng={longitude}
              >
                <button className="place-pin">
                  <img src="/place.svg" alt="place"/>
                </button>
              </Marker>
            );
          })}


        </GoogleMapReact>
        <div>Icons made by
          <a href="https://www.flaticon.com/free-icon/place_1452563" title="Kiranshastry"> Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
        </div>
  );
}

export default App;
