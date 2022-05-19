"use strict";
let storageId;
const xhr = new XMLHttpRequest(),
    url = `fastest-cars.json`;
let output = "";

xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
        storageId = localStorage.getItem("id"); //grab local saved id
        const src = JSON.parse(xhr.responseText);
        //https://stackoverflow.com/questions/7075485/get-one-item-from-an-array-of-name-value-json/43547641
        //answer #3 helped me, they suggested using .find()!
        const s = src.find(sc => sc.id == storageId); //checks if the id equals the one put in storage
        output += details(s);
        carDetails.innerHTML = output;
    }
};
xhr.open("GET", url, true);
xhr.send();

const details = (data) => {
        return `
            <section id = "details">
            <h1 class = "make-model-title">${data.make} ${data.model}</h1>
            <section id = "detail">
            <picture id = "car-image-details">
                <source media = "(min-width: 768px)" srcset = '${data.image.sixHundred}'>
                <source media = "(min-width: 414px)" srcset = "${data.image.threeFifty}">
                <source media = "(min-width: 375px)" srcset = "${data.image.threeFifty}">
                <source media = "(max-width: 320px)" srcset = "${data.image.threeHundred}">
                <source media = "(min-width: 0px)" srcset = "${data.image.threeHundred}">
                <img src = "${data.image.sixHundred}"/>
            </picture>
                    <span id = "top-speed">
                        <h4 id = "top_speed_title">Top Speed</h4> <h4 id = "topSpeedAmt">: &nbsp; ${data.top_speed}mph</h4>
                    </span>
                    <section id = "description">
                        <h4>Description</h4>
                        <p> ${data.description}</p>
                    </section>
                </section>
            </section>
        `   
}