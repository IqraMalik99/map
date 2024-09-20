
// const socket = io();
// try {
//     if(navigator.geolocation){
//         console.log("Have");
//         navigator.geolocation.watchPosition((position)=>{
//             console.log("Having position ",position.coords);
            
//             const{latitude,longitude}=position.coords;    //function
//    socket.emit("client-message", {latitude,longitude});

//         },(error)=>{
//             console.log(`error inside watch ${error}`);   // error
            
//         },{
//             timeout:100,                               // setting
//             maximumAge:0,
//             enableHighAccuracy:true
//         })
//     }
// } catch (error) {
//     console.log("error in watching position" , error)
// }

// const map = L.map("map").setView([0,0],16);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
//     attribute:""
// }).addTo(map);
// const marker ={};
// socket.on("server-message",(msg)=>{
//    let{id,latitude,longitude}=msg;
//    map.setView([latitude,longitude],16);
// //    if(marker[id]){
// //     marker[id].setLatLng([latitude,longitude],16);
// //    }else{
// //     marker[id]=L.marker([latitude,longitude],16).addTo(map);
// //    }
//     marker[id]=L.marker([latitude,longitude],16).addTo(map);

// })
// socket.on("user-disconnection",(id)=>{
//     if(marker[id]){
//         map.removeLayer(marker[id])
//         delete marker[id];
//     }
// })







const socket = io();

try {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
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

// let map = L.map("map").setView([0, 0], 16);
const map = L.map("map").setView([51.505, -0.09], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let markers = {};

socket.on("server-message", (msg) => {
    const { id, latitude, longitude } = msg;
    map.setView([latitude,longitude],16);
    if (markers[id]) {
        // Update existing marker position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnection", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
