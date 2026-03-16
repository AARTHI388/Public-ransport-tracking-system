import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* BUS ICON */
const busIcon = new L.Icon({
  iconUrl: "/bus.png",
  iconSize: [35, 35]
});

function MapComponent() {

  /* BUS ROUTE */
  const route = [
    [13.0827, 80.2707],
    [13.0845, 80.2725],
    [13.0860, 80.2750],
    [13.0875, 80.2780],
    [13.0890, 80.2800]
  ];

  /* BUS STOPS */
  const busStops = [
    { name: "Stop 1", lat: 13.0827, lng: 80.2707 },
    { name: "Stop 2", lat: 13.0845, lng: 80.2725 },
    { name: "Stop 3", lat: 13.0860, lng: 80.2750 },
    { name: "Stop 4", lat: 13.0875, lng: 80.2780 }
  ];

  /* BUS POSITION */
  const [busIndex, setBusIndex] = useState(0);

  const [busPosition, setBusPosition] = useState(route[0]);

  const [userLocation, setUserLocation] = useState(null);

  const [nearestStop, setNearestStop] = useState(null);

  const [eta, setEta] = useState(null);

  /* BUS MOVEMENT ANIMATION */
  useEffect(() => {

    const interval = setInterval(() => {

      setBusIndex((prev) => {
        const next = (prev + 1) % route.length;
        setBusPosition(route[next]);
        return next;
      });

    }, 3000);

    return () => clearInterval(interval);

  }, []);

  /* GET USER LOCATION */
  useEffect(() => {

    navigator.geolocation.getCurrentPosition((pos) => {

      const location = [
        pos.coords.latitude,
        pos.coords.longitude
      ];

      setUserLocation(location);

      findNearestStop(location);

    });

  }, []);

  /* DISTANCE FUNCTION */
  function distance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;

    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /* FIND NEAREST BUS STOP */
  function findNearestStop(user) {

    let minDist = Infinity;
    let closest = null;

    busStops.forEach(stop => {

      const dist = distance(
        user[0],
        user[1],
        stop.lat,
        stop.lng
      );

      if (dist < minDist) {
        minDist = dist;
        closest = stop;
      }

    });

    setNearestStop(closest);

    /* ETA calculation (bus speed 30 km/h) */
    const busDist = distance(
      busPosition[0],
      busPosition[1],
      closest.lat,
      closest.lng
    );

    const speed = 30;

    const time = (busDist / speed) * 60;

    setEta(time.toFixed(1));

  }

  return (

    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ROUTE */}
      <Polyline positions={route} color="blue" />

      {/* BUS */}
      <Marker position={busPosition} icon={busIcon}>
        <Popup>Moving Bus</Popup>
      </Marker>

      {/* BUS STOPS */}
      {busStops.map((stop, i) => (
        <Marker key={i} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* USER LOCATION */}
      {userLocation && (
        <Circle
          center={userLocation}
          radius={100}
          pathOptions={{ color: "green" }}
        />
      )}

      {/* NEAREST STOP INFO */}
      {nearestStop && (
        <Marker position={[nearestStop.lat, nearestStop.lng]}>
          <Popup>
            Nearest Stop: {nearestStop.name} <br />
            Bus ETA: {eta} minutes
          </Popup>
        </Marker>
      )}

    </MapContainer>

  );
}

export default MapComponent;