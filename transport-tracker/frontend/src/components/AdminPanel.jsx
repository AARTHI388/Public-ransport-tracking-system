import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function AdminPanel() {

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const sendLocation = () => {

    socket.emit("busLocation", {
      id: 1,
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });

  };

  return (

    <div>

      <h2>Admin Bus Control</h2>

      <input
        placeholder="Latitude"
        onChange={(e) => setLat(e.target.value)}
      />

      <input
        placeholder="Longitude"
        onChange={(e) => setLng(e.target.value)}
      />

      <button onClick={sendLocation}>
        Move Bus
      </button>

    </div>

  );
}

export default AdminPanel;