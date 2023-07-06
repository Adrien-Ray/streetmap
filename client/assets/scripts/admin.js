
import { env } from "./main.js";

var categoryArray = [];
var objectsArray = [];

document.querySelector('.content__categoryAdd__submit').addEventListener('click', () => {
    if (!document.querySelector('.content__categoryAdd__name').value || document.querySelector('.content__categoryAdd__name').value === "") {
        return alert('un nom doit être renseigné');
    }
    fetch(`${env.apiRootUrl}/map_category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.querySelector('.content__categoryAdd__name').value,
                description: document.querySelector('.content__categoryAdd__desc').value
            })
        })
            .then(response => {
                if (response.status !== 201) {
                alert('une erreur est survenu');
                }
                return response.json();
            })
            .then(data => {
                document.querySelector('.content__categoryAdd__name').value = "";
                document.querySelector('.content__categoryAdd__desc').value = "";
                mainSetList();
                return;
            })
            .catch(error => console.error(error));
});

const deleteCat = (id, name) => {
    const verif  = confirm(`êtes vous sure de supprimer la categorie ${name}`);
    if (verif) {
        fetch(`${env.apiRootUrl}/map_category/${id}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.status !== 200) {
                    alert('une erreur est survenu');
                    }
                    return response.json();
                })
                .then(data => {
                    // delete cascade objects
                    const objectsArrayFilter = objectsArray.filter(obj => obj.map_categoryId === id);
                    console.log('objectsArrayFilter', objectsArrayFilter);
                    return objectsArrayFilter;
                })
                .then(objectsArrayFilter => {
                    for (let index = 0; index < objectsArrayFilter.length; index++) {
                        const element = objectsArrayFilter[index];
                        fetch(`${env.apiRootUrl}/map_object/${element.id}`, {
                            method: 'DELETE'
                        })
                        .catch(error => console.error(error));
                    }
                    return;
                })
                .then( () => {
                    alert('delete succed')
                    mainSetList();
                    return;
                })
                .catch(error => console.error(error));
    }
}

function deleteObj(thisId) {
    const verif  = confirm(`êtes vous sure de supprimer l'objet ID ${thisId} ?`);
    if (verif) {
        fetch(`${env.apiRootUrl}/map_object/${thisId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.status !== 200) {
                    alert('une erreur est survenu');
                    }
                    return response.json();
                })
                .then( () => {
                    alert('delete succed')
                    mainSetList();
                    return;
                })
                .catch(error => console.error(error));
    }
}

function listObj() {
    fetch(`${env.apiRootUrl}/map_category`, { method: 'GET' })
        .then(response => {
            if (response.status !== 200) {
            alert('une erreur est survenu');
            }
            return response.json();
        })
        .then(dataArray => {
            categoryArray = dataArray;
        })
        .catch(error => console.error(error));
    fetch(`${env.apiRootUrl}/map_object`, { method: 'GET' })
        .then(response => {
            if (response.status !== 200) {
            alert('une erreur est survenu');
            }
            return response.json();
        })
        .then(dataArray => {
            objectsArray = dataArray;
        })
        .catch(error => console.error(error));
}

function setListObj() {
    let catListDom = "";
    for (let index = 0; index < categoryArray.length; index++) {
        const element = categoryArray[index];
        catListDom = catListDom + `<div class="content__object__list__itemCat" title="${element.description}"><span>${element.id}</span> | <span>${element.name}</span><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg></div>`;
        for (let index = 0; index < objectsArray.length; index++) {
            const element2 = objectsArray[index];
            if (element2.map_categoryId === element.id) {
                catListDom = catListDom + `<div class="content__object__list__itemObj" title=""><span>${element2.id}</span> | <span>${element2.type}${(element2.title) ? ' | ' + element2.title : ''}</span><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-180h44l443-443-44-44-443 443v44Zm614-486L666-794l42-42q17-17 42-17t42 17l44 44q17 17 17 42t-17 42l-42 42Zm-42 42L248-120H120v-128l504-504 128 128Zm-107-21-22-22 44 44-22-22Z"/></svg></div>`;
            }
        }
    }
    document.querySelector('.content__object__list').innerHTML = catListDom;

    const items = document.querySelectorAll('.content__object__list__itemCat');
    for (let index = 0; index < items.length; index++) {
        const element = items[index].children[2];
        const thisId = parseInt(items[index].children[0].innerText);
        const thisName = items[index].children[1].innerText;
        const thisDesc = items[index].title;
        element.addEventListener('click', () => {
            deleteCat(thisId, thisName);
        });
        const element2 = items[index].children[3];
        element2.addEventListener('click', () => {
            const newName = prompt(`edit ${thisName}<br>nom de la categorie:`, `${thisName}`);
            const newDesc = prompt(`edit ${thisName}<br>description de la categorie:`, `${thisDesc}`);

            fetch(`${env.apiRootUrl}/map_category/${thisId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    description: newDesc
                })
            })
                .then(response => {
                    if (response.status !== 200) {
                    alert('une erreur est survenu');
                    }
                    return response.json();
                })
                .then(data => {
                    document.querySelector('.content__categoryAdd__name').value = "";
                    document.querySelector('.content__categoryAdd__desc').value = "";
                    mainSetList();
                    return;
                })
                .catch(error => console.error(error));
        });
    }

    const itemsObj = document.querySelectorAll('.content__object__list__itemObj');
    for (let index = 0; index < itemsObj.length; index++) {
        const element = itemsObj[index].children[2];
        const thisId = parseInt(itemsObj[index].children[0].innerText);
        const thisName = itemsObj[index].children[1].innerText;
        const thisDesc = itemsObj[index].title;
        element.addEventListener('click', () => {
            deleteObj(thisId);
        });
        // ci dessous modif obj
        const element2 = itemsObj[index].children[3];
        element2.addEventListener('click', () => {
            window.location = `./admin_objectPostUpdate.html?id=${thisId}`;
        });
    }
}

function mainSetList() {
    listObj();
    setTimeout(() => {
        setListObj();
    }, 200);
}

mainSetList();