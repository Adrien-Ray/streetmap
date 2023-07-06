import { env } from "./main.js";

function listCat() {
    fetch(`${env.apiRootUrl}/map_category`, { method: 'GET' })
            .then(response => {
                if (response.status !== 200) {
                alert('une erreur est survenu. code error 24578006');
                }
                return response.json();
            })
            .then(data => {
                let catListDom = "<ul>";
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    catListDom = catListDom + `<li title="${element.description}"><label for="cat${element.id}"><input id="cat${element.id}" name="map_categoryId" type="radio" value="${element.id}"><span>${element.id}</span> | <span>${element.name}</span></label></li>`;
                }
                catListDom = catListDom + "</ul>";
                document.querySelector('.catForObj').innerHTML = catListDom;
                return;
            })
            .catch(error => console.error(error));
}

listCat();

var params = new URLSearchParams(window.location.search);
console.log(params.get('id'));
if (params.get('id')) {
    // window.location = './admin.html';
    fetch(`${env.apiRootUrl}/map_object/${params.get('id')}`, { method: 'GET' })
            .then(response => {
                if (response.status !== 200) {
                alert('une erreur est survenu. code error 24578006');
                }
                return response.json();
            })
            .then(data => {
                // display values
                console.log(data);
                document.querySelector(`#${data.type}`).checked = true;
                if (data.title) {
                    document.querySelector(`#title`).value = data.title;
                }
                document.querySelector(`.popupContent`).value = data.popupContent;
                document.querySelector(`#cat${data.map_categoryId}`).checked = true;
                let hiddeninput = document.createElement('input');
                hiddeninput.id = 'id';
                hiddeninput.type = 'hidden';
                hiddeninput.name="id";
                hiddeninput.value=`${data.id}`;
                document.querySelector('form.content__objectAdd').prepend(hiddeninput);
                document.querySelector('#argsIco').value = data.args.ico;
                document.querySelector('#argsColor').value = data.args.color;
                document.querySelector('#argsRadius').value = data.args.radius;
                document.querySelector('#geodata').innerText = JSON.stringify(data.geoData).slice(1, -1);
                return;
            })
            .catch(error => console.error(error));
}

setTimeout(() => {
    tinymce.init({
        selector: '.tinyMce',
        height: '300px',
        language: 'fr_FR',
        plugins: 'link image media table emoticons fullscreen lists',
        toolbar1: 'fullscreen undo redo | styleselect | bold italic alignleft aligncenter alignright alignjustify outdent indent numlist bullist | link image media     emoticons',
        language_url : './assets/scripts/fr_FR.js'
    });
}, 300);
