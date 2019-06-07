let request = new XMLHttpRequest();

const app = document.getElementById('app');
const dropdown = document.getElementById('dropdown');
const searchBox = document.getElementById('search-box');
const searchScreen = document.getElementById('search-screen');
const calorieScreen = document.getElementById('calorie-screen');
const nutritionInfo = document.getElementById('nutrition-info');

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
    calorieScreen.classList.add('show');

    let params = {
        "query": foodName
    };

    request.onload = createNutritionList;

    request.send(JSON.stringify(params));
}

function getBrandedNutrients(foodID) {
    console.log(foodID);

    searchScreen.style.display = "none";
    calorieScreen.classList.add('show');

    request.open('GET', 'https://trackapi.nutritionix.com/v2/search/item?nix_item_id=' + foodID);
    setHTTPHeaders(request);

    request.onload = createNutritionList;

    request.send();
}

function createNutritionList() {
    let data = JSON.parse(this.response);
    console.log(data);
    let food = data.foods[0];
    let h2 = calorieScreen.firstElementChild;
    h2.innerHTML = "showing info for " + food.serving_qty + " " + food.serving_unit + "(" + food.serving_weight_grams + "g)";

    let list = document.createDocumentFragment();

    let calories = document.createElement('li');
    calories.textContent = "calories: " + food.nf_calories;
    list.appendChild(calories);

    let fat = document.createElement('li');
    fat.textContent = "fat: " + food.nf_total_fat;
    list.appendChild(fat);

    let saturatedFat = document.createElement('li');
    saturatedFat.textContent = "of which saturated fat: " + food.nf_saturated_fat;
    list.appendChild(saturatedFat);

    let carbohydrates = document.createElement('li');
    carbohydrates.textContent = "carbohydrates: " + food.nf_total_carbohydrate;
    list.appendChild(carbohydrates);

    let sugars = document.createElement('li');
    sugars.textContent = "of which sugars: " + food.nf_sugars;
    list.appendChild(sugars);

    let fibre = document.createElement('li');
    fibre.textContent = "fibre: " + food.nf_dietary_fiber;
    list.appendChild(fibre);

    let proteins = document.createElement('li');
    proteins.textContent = "proteins: " + food.nf_protein;
    list.appendChild(proteins);


    nutritionInfo.appendChild(list);
}

document.getElementById('go-back').addEventListener('click', e => {
    calorieScreen.classList.remove('show');
    searchScreen.style.display = 'flex';
    searchBox.value = "";
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }
});

