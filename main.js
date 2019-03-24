let request = new XMLHttpRequest();

// request.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=grilled cheese', true);

// request.setRequestHeader("x-remote-user-id", "0");

const app = document.getElementById('app');
const dropdown = document.getElementById('dropdown');
const searchBox = document.getElementById('search-box');

searchBox.addEventListener('keyup', displaySuggestions);

function displaySuggestions() {
    let input = searchBox.value;

    dropdown.innerHTML = "";

    request.open('GET', 'https://trackapi.nutritionix.com/v2/search/instant?query=' + input, true);
    request.setRequestHeader("x-app-id", "db151094");
    request.setRequestHeader("x-app-key", "37ea7f59f00e14444a1c9a73a69ca4a3");

    const instantList = document.createDocumentFragment();

    request.onload = function () {
        let data = JSON.parse(this.response);

        // console.log(data);
        for (let type in data) {
            console.log(type);

            const h2 = document.createElement('h2');
            h2.textContent = type;
            instantList.append(h2);

            // data[type].forEach(food => {
            //     console.log(food.food_name);
            //     const li = document.createElement('li');
            //     li.textContent = food.food_name;
            //     instantList.appendChild(li);
            // });

            for (let i = 0; i < 5; i++) {
                console.log(data[type][i].food_name);
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.setAttribute('class', 'food-item');
                li.appendChild(div);
                const thumbnail = document.createElement('img');
                const foodName = document.createElement('p');
                thumbnail.setAttribute('src', data[type][i].photo.thumb);
                foodName.textContent = data[type][i].food_name;
                div.appendChild(thumbnail);
                div.append(foodName);
                instantList.appendChild(li);
            }

            dropdown.append(instantList);
        }

        // app.appendChild(list);

    }

    request.send();
}


