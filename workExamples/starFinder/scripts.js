"use strict"

let characterNumber = 0;
let randomStatus;
let searchStatus;

//Load event
window.onload = (e) => {
    document.querySelector("#filter").onchange = getAllCharacters;
    document.querySelector("#searchButton").onclick = getSearchCharacter;
    document.querySelector("#search").onchange = e => {
        localStorage.setItem(searchKey, e.target.value);
    }
    document.querySelector("#newRandom").onclick = getAllCharacters;
    randomStatus = document.querySelector("#randomStatus");
    searchStatus = document.querySelector("#searchStatus");
    searchStatus.innerHTML = "Status: Ready to search";
    randomStatus.innerHTML = "Status: Ready for random characters!";
};

//Proxy URL is used due to SWAPI not having CORS enabled.
const proxyurl = "https://cors-anywhere.herokuapp.com/";

//Gets and displays the saved search term, if there is one
const prefix = "eh8582-";
const searchKey = prefix + "searchTerm";
const storedSearchTerm = localStorage.getItem(searchKey);
document.querySelector("#search").value = storedSearchTerm;

//Function will pull up characters at random
function getAllCharacters() {
    randomStatus.innerHTML = "Status: Ready for random!";

    //Form the proper URL
    const STAR_URL = "http://swapi.co/api/";
    let url = STAR_URL;
    let filter = document.querySelector("#filter");
    let selectedMovie = filter.options[filter.selectedIndex].value;

    //Pick a random movie if the user didn't pick one
    while (selectedMovie == 0) {
        selectedMovie = Math.floor(Math.random() * 6)
    }
    url = STAR_URL;
    url += "films/" + selectedMovie + "/";

    //Add the loading icon to the character panels
    for (let i = 1; i < 4; i++) {
        document.querySelector(".front" + i).innerHTML = '<img src="images/spinner.gif">';
    }

    //Now that the url is created, request the character data
    requestCharacterData(proxyurl + url);
}

//This function will get characters based on a search term instead of random characters
function getSearchCharacter() {
    //Form the url
    const STAR_URL = "http://swapi.co/api/";
    let url = STAR_URL;
    let searchTerm = document.querySelector("#search").value;

    //Add user input to the url, after sanitizing it
    if (searchTerm != "") {
        document.querySelector(".searchFront").innerHTML = '<img src="images/spinner.gif">';
        searchTerm = searchTerm.trim();
        searchTerm = encodeURIComponent(searchTerm);
        url += "people/?search=" + searchTerm;
        requestSearch(proxyurl + url);
    }
}

//Responsible for making the server request for random characters
function requestCharacterData(url) {
    randomStatus.innerHTML = "Status: Requesting random info from SWAPI"
    let xhr = new XMLHttpRequest();

    xhr.onerror = dataError;
    xhr.onload = filmDataLoaded;

    xhr.open("GET", url);
    xhr.send();
}

//Responsible for making the server request for a search term
function requestSearch(url) {
    searchStatus.innerHTML = "Status: Searching for character by name..."

    let xhr = new XMLHttpRequest();

    xhr.onerror = dataError;
    xhr.onload = searchDataLoaded;

    xhr.open("GET", url);
    xhr.send();
}

//When data is loaded, this grabs the response
function filmDataLoaded(e) {
    let xhr = e.target;

    //Loads characters on successful request
    getCharactersFromFilm(xhr.responseText);
}
//When data is loaded, this gets the response data
function searchDataLoaded(e) {
    let xhr = e.target;
    getSearchResult(xhr.responseText);
}

function getSearchResult(data) {
    searchStatus.innerHTML = "Status: Search Complete!"
    let object = JSON.parse(data).results[0];
    parseSearchData(object);
}

//This function will pick three random characters from the list of characters in the film
function getCharactersFromFilm(data) {

    //Parse response data
    let object = JSON.parse(data); //Usabale JS object
    let possibleCharacters = object.characters; //All of the characters

    //Randomly selects three characters
    let selectedCharacters = [];
    for (let i = 0; i < 3; i++) {
        selectedCharacters.push(possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)]);

        //Now access character data and put it into the page
        getCharacterData(selectedCharacters[i]);
    }
}

//Get characters from film gave us url's to character info; now we request data from those urls
function getCharacterData(url) {
    let xhr = new XMLHttpRequest();
    xhr.onerror = dataError;
    xhr.open("GET", proxyurl + url);
    xhr.send();
    xhr.onload = (e) => {
        randomStatus.innerHTML = "Status: Parsing random character data..."
        let xhr = e.target;

        //Parse character data on successful request
        parseCharacterData(xhr.responseText);
    };
}

//Called to parse in character data
function parseCharacterData(data) {

    let object = JSON.parse(data);

    if (characterNumber == 3) {
        characterNumber = 0
    } else if (characterNumber == 2) {
        randomStatus.innerHTML = "Status: Random complete!";
    }
    characterNumber++;
    let front = document.querySelector(".front" + characterNumber);
    front.innerHTML = object.name + "<br>Click here for character info!";
    let backData = document.querySelector(".data" + characterNumber);
    backData.innerHTML = "Name: " + object.name + "<br>" +
        "Gender: " + object.gender + "<br>" + "Birth Year: " + object.birth_year + "<br>" + "Height: " + object.height + "<br>" + "Mass: " + object.mass + "<br>" + "Skin Color: " + object.skin_color + "<br>" + "Hair Color: " + object.hair_color + "<br>" +
        "Eye Color: " + object.eye_color;


}

//Parses the character data from SWAPI. Handles an error if the user's term didn't exist.
function parseSearchData(data) {
    let searchFront = document.querySelector(".searchFront");

//Catches user error
    if (data == undefined){
        searchStatus.innerHTML = "Status: Error! Search term not found!";
        searchFront.innerHTML = "Data wasn't found!";
    } else {
        searchFront.innerHTML = data.name + "<br>Click here for character info!";
        let searchData = document.querySelector(".searchData");
        searchData.innerHTML = "Name: " + data.name + "<br>" +
            "Gender: " + data.gender + "<br>" + "Birth Year: " + data.birth_year + "<br>" + "Height: " + data.height + "<br>" + "Mass: " + data.mass + "<br>" + "Skin Color: " + data.skin_color + "<br>" + "Hair Color: " + data.hair_color + "<br>" +
            "Eye Color: " + data.eye_color;
    }
}

//Function will report an error fetching data
function dataError(e) {
    console.log("An error occured when requesting data!");
}

//jQuery flipping behaviour
$(".flip").flip({
    trigger: 'click',
    reverse: false,
    axis: 'y'
});
$(".searchResult").flip({
    trigger: 'click',
    reverse: false,
    axis: 'y'
});