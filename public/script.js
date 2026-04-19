async function calculate() {
    const mileage = document.getElementById("mileage").value;
    const price = document.getElementById("price").value;
    const distance = document.getElementById("distance").value;

    const res = await fetch("/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mileage, price, distance })
    });  

    const data = await res.json();

    document.getElementById("result").innerText =
        `Fuel: ${data.fuel.toFixed(2)} L, Cost: ₹${data.cost.toFixed(2)}`;
}

async function saveTrip() {
    const mileage = document.getElementById("mileage").value;
    const price = document.getElementById("price").value;
    const distance = document.getElementById("distance").value;
    const fuel = distance / mileage;
    const cost = fuel * price;

    const res = await fetch("/save-trip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mileage,
            price,
            distance,
            fuel,
            cost,
            date: new Date().toLocaleString()
        })
    });

    const data = await res.json();
    alert(data.message);
}

async function loadTrips() {
    const res = await fetch("/trips");
    const data = await res.json();
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    data.forEach((trip, index) => {
        historyDiv.innerHTML += `
            <div>
                <p>Distance: ${trip.distance} km</p>
                <p>Cost: ₹${trip.cost}</p>
                <p>Date: ${trip.date}</p>
                <button onclick="deleteTrip(${index})">Delete</button>
                <hr>
            </div>
        `;
    });
}

window.onload = loadTrips;

async function deleteTrip(index) {
    await fetch(`/delete-trip/${index}`, {
        method: "DELETE"
    });

    loadTrips(); // refresh
}