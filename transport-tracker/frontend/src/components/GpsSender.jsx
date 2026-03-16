import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function GpsSender() {

  useEffect(() => {

    navigator.geolocation.watchPosition((position) => {

      const data = {
        id: 1,
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      socket.emit("busLocation", data);

    });

  }, []);

  return (
    <div>
      <h2>GPS Tracking Started</h2>
    </div>
  );
}

export default GpsSender;