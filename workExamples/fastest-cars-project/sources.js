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
        dynamicSources.innerHTML += output;
    }
};
xhr.open("GET", url, true);
xhr.send();

const display = (data) => {
    if (data.make === "Ford") { 
    //the GT is the only one not from Wikimedia Commons and so it doesn't require the author and changes made.
        return `
            <section id = "car-img-sources">
                <h4 class = "source-header"> ${data.make} ${data.model}</h4>
                <ul class = "source-data">
                    <li><strong><a class ="img-src" href = "${data.imageSource.url}">Image Source</a></strong></li>
                </ul>
            </section>
        `
    } else {
        return `
                    <section id = "car-img-sources">
                        <h4 class = "source-header"> ${data.make} ${data.model}</h4>
                        <ul class = "source-data">
                            <li class = "source-li"><strong><a class ="img-src" href = "${data.imageSource.url}">Image Source</a></strong></li>
                            <li class = "source-li"> Changes made: ${data.imageSource.changes_made}</li>
                            <li class = "source-li"> Author: ${data.imageSource.author}</li>
                        </ul>
                    </section>
        `
    }

}