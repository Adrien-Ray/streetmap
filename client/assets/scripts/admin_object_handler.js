import { env } from "./main.js";

var params = new URLSearchParams(window.location.search);

var inputData = {
    type : params.get('type'),
    geoData : params.get('geoData'),
    title : params.get('title'),
    popupContent : params.get('popupContent'),
    argsIco : params.get('argsIco'),
    argsColor : params.get('argsColor'),
    radius : params.get('argsRadius'),
    map_categoryId : params.get('map_categoryId'),
    id : params.get('id')
}

console.log("inputData", inputData);

if (params.get('id') !== null) {
    //alert('soon');
    //window.location = './admin.html';
    updateObj(inputData);
} else {
    addObject(inputData);
}

function addObject(inputData) {
    console.log(inputData);
    fetch(`${env.apiRootUrl}/map_object`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type : inputData.type,
                title : inputData.title,
                geoData : JSON.parse(`[${inputData.geoData}]`),
                popupContent : inputData.popupContent,
                args : {
                    ico : inputData.argsIco,
                    color : inputData.argsColor,
                    radius: parseInt(inputData.radius),
                },
                map_categoryId : parseInt(inputData.map_categoryId),
            })
        })
        .then(response => {
            if (response.status !== 201) {
            alert('une erreur est survenu');
            }
            return response.json();
        })
        .then(data => {
            alert('l\'objet a été enregistrer avec succès');
            window.location = './admin.html';
        })
        .catch(error => console.error(error));

}

function updateObj(inputData) {
    console.log(inputData);
    fetch(`${env.apiRootUrl}/map_object/${inputData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type : inputData.type,
                geoData : JSON.parse(`[${inputData.geoData}]`),
                title : inputData.title,
                popupContent : inputData.popupContent,
                args : {
                    ico : inputData.argsIco,
                    color : inputData.argsColor,
                    radius : parseInt(inputData.radius),
                },
                map_categoryId : parseInt(inputData.map_categoryId),
                id : parseInt(inputData.id),
            })
        })
        .then(response => {
            if (response.status !== 200) {
            alert('une erreur est survenu');
            }
            return;
        })
        .then(() => {
            alert('l\'objet a été modifier avec succès');
            window.location = './admin.html';
        })
        .catch(error => console.error(error));

}