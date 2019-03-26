let request = new XMLHttpRequest();

const app = document.getElementById('app');
const dropdown = document.getElementById('dropdown');
const searchBox = document.getElementById('search-box');

searchBox.addEventListener('keyup', sendRequest);

function sendRequest() {
    let input = searchBox.value;

    dropdown.innerHTML = "";

    request.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=' + input, true);
    request.setRequestHeader("x-app-id", "db151094");
    request.setRequestHeader("x-app-key", "37ea7f59f00e14444a1c9a73a69ca4a3");

    request.onload = displaySuggestions;

    request.send();
}

function displaySuggestions() {
    let data = JSON.parse(this.response);

    const instantList = document.createDocumentFragment();

    // console.log(data);
    createInstantListDOM(data, instantList);
}

function createInstantListDOM(data, instantList) {
    for (let type in data) {

        const h2 = document.createElement('h2');
        h2.textContent = type;
        instantList.append(h2);

        for (let i = 0; i < 5; i++) {
            const div = document.createElement('div');
            div.setAttribute('class', 'food-item');

            const li = document.createElement('li');
            li.appendChild(div);

            const imgWrapper = document.createElement('div');
            imgWrapper.setAttribute('class', 'img-wrapper');

            const thumbnail = document.createElement('img');
            thumbnail.setAttribute('src', data[type][i].photo.thumb);
            imgWrapper.appendChild(thumbnail);
            div.appendChild(imgWrapper);

            const foodName = document.createElement('p');
            foodName.textContent = data[type][i].food_name;

            div.append(foodName);

            instantList.appendChild(li);

        }

        dropdown.append(instantList);
    }
}


