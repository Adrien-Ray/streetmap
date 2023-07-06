const headerDomIn = `
<img src="./assets/ico/openstreetmapFavicon.png" alt="logo">
<h1>streetmap.net</h1>
<ul>
    <li><a href="./">accueil</a></li>
    <li><a href="./map.html">carte</a></li>
    <li><a href="./admin.html">admin</a></li>
</ul>`;
document.querySelector('header').innerHTML = headerDomIn;

export const env = {
    apiRootUrl : 'http://localhost:8083',
}