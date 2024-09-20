const socket = io();

try {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log(position.coords);
            socket.emit("client-message", { latitude, longitude });
        }, (error) => {
            console.log(`Error: ${error.message}`);
        }, {
            timeout: 5000,
            maximumAge: 0,
            enableHighAccuracy: true
        });
    }
} catch (error) {
    console.log("Error in watching position:", error);
}

let map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: ''
}).addTo(map);

let markers = {};

socket.on("server-message", (msg) => {
    const { id, latitude, longitude } = msg;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnection", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
