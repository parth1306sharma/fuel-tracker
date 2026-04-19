import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [distance, setDistance] = useState("");
  const [result, setResult] = useState("");
  const [trips, setTrips] = useState([]);

  // 🔹 Calculate
  const calculate = () => {
    if (!distance || !mileage || !price) {
      alert("Please fill all fields");
      return;
    }

    if (distance <= 0 || mileage <= 0 || price <= 0) {
      alert("Enter valid positive values");
      return;
    }

    const fuel = distance / mileage;
    const cost = fuel * price;

    setResult(`Fuel: ${fuel.toFixed(2)} L, Cost: ₹${cost.toFixed(2)}`);
  };

  // 🔹 Save Trip
  const saveTrip = () => {
    if (!result) {
      alert("Please calculate first");
      return;
    }

    const fuel = distance / mileage;
    const cost = fuel * price;

    const newTrip = {
      mileage,
      price,
      distance,
      fuel,
      cost,
      date: new Date().toLocaleString()
    };

    const savedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    savedTrips.push(newTrip);
    localStorage.setItem("trips", JSON.stringify(savedTrips));

    setTrips(savedTrips);

    // Clear inputs
    setMileage("");
    setPrice("");
    setDistance("");
    setResult("");
  };

  // 🔹 Delete Trip
  const deleteTrip = (index) => {
    const updatedTrips = trips.filter((_, i) => i !== index);
    setTrips(updatedTrips);
    localStorage.setItem("trips", JSON.stringify(updatedTrips));
  };

  // 🔹 Clear History
  const clearHistory = () => {
    localStorage.removeItem("trips");
    setTrips([]);
  };

  // 🔹 Load Trips
  const loadTrips = () => {
    const savedTrips = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(savedTrips);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // 🔹 Summary
  const totalFuel = trips.reduce((sum, t) => sum + Number(t.fuel), 0);
  const totalCost = trips.reduce((sum, t) => sum + Number(t.cost), 0);

  // 🔹 Sort (latest first)
  const sortedTrips = [...trips].reverse();

  // 🔥 Export CSV (Improved Format)
  const exportCSV = () => {
    if (trips.length === 0) {
      alert("No trips to export");
      return;
    }

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };

    const header = [
      "Trip ID",
      "Distance (km)",
      "Fuel (L)",
      "Cost (INR)",
      "Date"
    ];

    const rows = trips.map((t, index) => [
      index + 1,
      t.distance,
      Number(t.fuel).toFixed(2),
      Number(t.cost).toFixed(2),
      formatDate(t.date)
    ]);

    const summary = [
      [],
      ["Total Trips", trips.length],
      ["Total Fuel (L)", totalFuel.toFixed(2)],
      ["Total Cost (INR)", totalCost.toFixed(2)]
    ];

    const csv = [header, ...rows, ...summary]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fuel_report.csv";
    a.click();
  };

  return (
    <div className="container">
      <h1>⛽ Fuel Tracker</h1>

      <p className="tagline">
        Plan trips, estimate fuel cost, and track expenses.
      </p>

      <div className="input-group">
        <input
          type="number"
          placeholder="Mileage (km/l e.g. 15)"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Fuel Price (₹/l e.g. 100)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Distance (km e.g. 120)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />
      </div>

      <div className="button-group">
        <button onClick={calculate}>Calculate</button>
        <button onClick={saveTrip}>Save Trip</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>

      {result && <h2 className="result">{result}</h2>}

      {trips.length > 0 && (
        <div className="summary">
          <h3>📊 Summary</h3>
          <p>Total Trips: {trips.length}</p>
          <p>Total Fuel: {totalFuel.toFixed(2)} L</p>
          <p>Total Cost: ₹{totalCost.toFixed(2)}</p>
        </div>
      )}

      <div className="history">
        <h2>Trip History</h2>

        {trips.length === 0 ? (
          <p>No trips saved yet</p>
        ) : (
          <>
            {sortedTrips.map((trip, index) => (
              <div key={index} className="history-item">
                <p><strong>Distance:</strong> {trip.distance} km</p>
                <p><strong>Fuel:</strong> {Number(trip.fuel).toFixed(2)} L</p>
                <p><strong>Cost:</strong> ₹{Number(trip.cost).toFixed(2)}</p>
                <p><strong>Date:</strong> {trip.date}</p>

                <button onClick={() => deleteTrip(index)}>
                  Delete
                </button>
              </div>
            ))}

            <button onClick={clearHistory} className="clear-btn">
              Clear History
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;