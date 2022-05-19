"use strict";

const xhr = new XMLHttpRequest(),
    url = "fastest-cars.json";
let output = "";

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        const srcObj = JSON.parse(xhr.responseText);
        for (let s of srcObj) {
            output += display(s);
        }
        carsList.innerHTML = output; //ES6 allows you to use the ID of the element as a variable!
    }
};
xhr.open("GET", url, true);
xhr.send();

// Good place to put that function that will generate the template html
const display = (data) => {
        /*
        One issue: When I first loaded this on chrome, it auto-translated the 
        "Absolut" from "Koenigsegg Jesko Absolut" to "Absolutely" (German --> English). 
        Please make sure to turn that off when you test it!
        */
        return `
            <section id = "cars" onclick = "loadDetails(${data.id})">
            <picture id = "car-image">
                <source media = "(min-width: 768px)" srcset = '${data.image.sixHundred}'>
                <source media = "(min-width: 414px)" srcset = "${data.image.threeFifty}">
                <source media = "(min-width: 375px)" srcset = "${data.image.threeFifty}">
                <source media = "(max-width: 320px)" srcset = "${data.image.threeHundred}">
                <source media = "(min-width: 0px)" srcset = "${data.image.threeHundred}">
                <img src = "${data.image.sixHundred}"/>
            </picture>
                <section id = "car">
                        <span class = "make-model">
                            <h4>${data.make} ${data.model}</h4>
                        </span>
                </section>
            </section>
        `

}
const loadDetails = (id) => {
    localStorage.setItem("id", id); //set id to localStorage!
    window.location.href = "details.html"; //switch to details.html
}