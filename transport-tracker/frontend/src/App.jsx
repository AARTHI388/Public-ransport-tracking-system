import MapComponent from "./components/Map";
import GpsSender from "./components/GpsSender";

function App() {
  return (
    <div>

      <h1 style={{textAlign:"center"}}>
        Public Transport Tracking System
      </h1>

      {/* GPS tracking from mobile */}
      <GpsSender />

      {/* Map showing buses */}
      <MapComponent />

    </div>
  );
}

export default App;