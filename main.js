let request = new XMLHttpRequest();

const app = document.getElementById('app');
const dropdown = document.getElementById('dropdown');
const searchBox = document.getElementById('search-box');
const searchScreen = document.getElementById('search-screen');
const calorieScreen = document.getElementById('calorie-screen');

searchBox.addEventListener('keyup', sendRequest);


function setHTTPHeaders(request) {
    request.setRequestHeader("x-app-id", "db151094");
    request.setRequestHeader("x-app-key", "37ea7f59f00e14444a1c9a73a69ca4a3");
    request.setRequestHeader("Content-Type", "application/json");
}

function sendRequest() {
    let input = searchBox.value;

    dropdown.innerHTML = "";

    request.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=' + input, true);
    setHTTPHeaders(request);

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
            let currentFood = data[type][i];

            const div = document.createElement('div');
            div.setAttribute('class', 'food-item');

            const li = document.createElement('li');
            li.appendChild(div);

            const imgWrapper = document.createElement('div');
            imgWrapper.setAttribute('class', 'img-wrapper');

            const thumbnail = document.createElement('img');
            thumbnail.setAttribute('src', currentFood.photo.thumb);
            imgWrapper.appendChild(thumbnail);
            div.appendChild(imgWrapper);

            const foodName = document.createElement('p');
            foodName.textContent = currentFood.food_name;

            div.append(foodName);

            instantList.appendChild(li);

            if (type == 'common') {
                div.addEventListener('click', function () { getCommonNutrients(currentFood.food_name) });
            } else if (type == 'branded') {
                div.addEventListener('click', function () { getBrandedNutrients(currentFood.nix_item_id) });
            }
        }

        dropdown.append(instantList);
    }
}

function getCommonNutrients(foodName) {
    console.log(foodName);

    request.open('POST', "https://trackapi.nutritionix.com/v2/natural/nutrients");
    setHTTPHeaders(request);

    searchScreen.style.display = "none";
    calorieScreen.style.display = 'block';

    let params = {
        "query": foodName
    };

    request.onload = function () {
        let data = JSON.parse(this.response);
        console.log(data);
    }

    request.send(JSON.stringify(params));
}

function getBrandedNutrients(foodID) {
    console.log(foodID);

    searchScreen.style.display = "none";
    calorieScreen.style.display = 'block';

    request.open('GET', 'https://trackapi.nutritionix.com/v2/search/item?nix_item_id=' + foodID);
    setHTTPHeaders(request);

    request.onload = function () {
        let data = JSON.parse(this.response);
        console.log(data);
    }

    request.send();
}

