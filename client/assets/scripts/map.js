export var map = L.map('map').setView([47.32142,  5.04129], 13);

L.control.scale({metric: true, imperial: false}).addTo(map); // add echelle

var popup2 = L.popup();

function onMapClick(e) {
    popup2
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}
map.on('contextmenu', onMapClick);

let layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

document.querySelector('.sateliteToggle').innerText = 'satelite layer';
document.querySelector('.sateliteToggle').addEventListener('click', () => {
    map.removeLayer(layer); // evite la superposition de layers
    if (document.querySelector('.sateliteToggle').innerText === 'satelite layer') {
        document.querySelector('.sateliteToggle').innerText = 'openstreetmap layer';
        // add satelite layer
        layer = L.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="http://www.esri.com/">Esri</a>',
            maxZoom: 19,
            }).addTo(map);
    } else {
        document.querySelector('.sateliteToggle').innerText = 'satelite layer';
        // remove satelite layer
        layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
});