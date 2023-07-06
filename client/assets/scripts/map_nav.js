import { map } from "./map.js";
import { env } from "./main.js";
var marker = [];

document.querySelector('.content__map__nav__hover').addEventListener('click', () => {
    document.querySelector('.content__map__nav').classList.toggle('display');
});

function listCat() {
    fetch(`${env.apiRootUrl}/map_category`, { method: 'GET' })
            .then(response => {
                if (response.status !== 200) {
                alert('une erreur est survenu');
                }
                return response.json();
            })
            .then(data => {
                // console.log('data L14 : ', data);
                let catListDom = "<h3>Liste des catégories</h3><ul>";
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    catListDom = catListDom + `<li class="content__map__nav__catItem" title="${element.description}"><label for="cat${element.id}"><input id="cat${element.id}" name="cat${element.id}" type="checkbox"><span>${element.id}</span> | <span>${element.name}</span></label></li>`;
                }
                catListDom = catListDom + "</ul>";
                document.querySelector('.content__map__nav__catList').innerHTML = catListDom;
                const items = document.querySelectorAll('.content__categoryExist ul li');
                console.log(items);
                for (let index = 0; index < items.length; index++) {
                    const element = items[index];
                    const thisId = parseInt(items[index].children[0].innerText);
                    const thisName = items[index].children[1].innerText;
                    const thisDesc = items[index].title;
                }
                return;
            })
            .catch(error => console.error(error));
}

listCat();

document.querySelector('.content__map__nav__catList').addEventListener('click', () => {
    //clean existing layer
    for (let index = 0; index < marker.length; index++) {
        map.removeLayer(marker[index]);
    }
    marker = [];
    setTimeout(() => {
        getObjByCheckLayer();
    }, 50);
});

function getObjByCheckLayer() {
    // get list id of checked category
    const list = document.querySelectorAll('.content__map__nav__catItem');
    const arrayList = Array.from(list);
    const listArrayFilter = arrayList.filter(cat => cat.childNodes[0].childNodes[0].checked === true);
    const arrayCatId = [];
    for (let index = 0; index < listArrayFilter.length; index++) {
        const element = listArrayFilter[index];
        arrayCatId.push(Number.parseInt(element.childNodes[0].childNodes[0].id.substring(3)));
    }
    // get all map_object of checked category
    const allObjects = [];
    const fetchPromises = [];
    for (let index = 0; index < arrayCatId.length; index++) {
        const catId = arrayCatId[index];
        const fetchPromise = fetch(`${env.apiRootUrl}/map_object?map_categoryId=${catId}`, { method: 'GET' })
            .then(response => {
                if (response.status !== 200) {
                    alert('une erreur est survenue');
                }
                return response.json();
            })
            .then(data => {
            for (let index = 0; index < data.length; index++) {
                const map_object = data[index];
                allObjects.push(map_object);
            }
            })
            .catch(error => console.error(error));
        fetchPromises.push(fetchPromise);
    }
    Promise.all(fetchPromises)
        .then(() => {
            // scope result obj by checked layers
            console.log('allObjects:', allObjects);
            displayObjects(allObjects, listArrayFilter);
        })
        .catch(error => console.error(error));
}

function displayObjects(allObjects, listArrayFilter) {
    console.log('listArrayFilter', listArrayFilter);
    for (let index = 0; index < allObjects.length; index++) {
        const element = allObjects[index];
        const catObj = listArrayFilter.find(cat => cat.childNodes[0].childNodes[0].id === `cat${element.map_categoryId}`);
        const nameCat = catObj.childNodes[0].childNodes[3].innerText;
        const forBindPopup = `<b>${element.title}</b><hr>` + element.popupContent + "<br>cat "+element.map_categoryId+" | " + nameCat + "<br><a href='./admin_objectPostUpdate.html?id=" + element.id +"' target='_target'>modifier</a>";
        if (element.type === "marker") {
            let args = {};
            if (element.args.ico && element.args.ico !== "") {
                args.icon = L.icon({
                    iconUrl: `./assets/ico/markers/${element.args.ico}`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                    popupAnchor: [0, -20],
                    className: 'iconGoogleMat'
                });
            }
            console.log('ico personalizés', args);
            marker.push(L.marker([element.geoData[0], element.geoData[1]], args).addTo(map).bindPopup(forBindPopup));
        } else if (element.type === "polygon") {
            marker.push(L.polygon([element.geoData], {
                color: element.args.color,
                fillColor: element.args.color,
                fillOpacity: 0.4,
                weight: 2,
            }).addTo(map).bindPopup(forBindPopup));
        } else if (element.type === "circle") {
            marker.push(L.circle(element.geoData, {
                color: element.args.color,
                fillColor: element.args.color,
                fillOpacity: 0.4,
                radius: element.args.radius // donne le rayon en mètre
            }).addTo(map).bindPopup(forBindPopup));
        } else if (element.type === "polyline") {
            marker.push(L.polyline(element.geoData, {color: element.args.color}).addTo(map).bindPopup(forBindPopup));
        }
    }
}


document.querySelector('.darkmodToggle').addEventListener('click', () => {
    document.querySelector('.content--map').classList.toggle('darkmod');
});