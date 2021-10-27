const urlPeople = 'https://swapi.dev/api/people/?page=';
const nameList = document.querySelector(".list");
const details = document.querySelector(".details");
const h2Detail = document.querySelector("h2");
const previous = document.querySelector(".previous");
const next = document.querySelector(".next");
const loader = document.querySelector(".loader");

let page = 0;
let result = [];

h2Detail.textContent = "";

async function getPage(page){
    let response = await fetch(urlPeople + page);
    let data = await response.json();
    return data;
}
async function getPages(currentPage, next){
    while (next !== null){
        const pageData = await getPage(currentPage);
        result.push(...pageData.results);
        next = pageData.next;
        console.log('loading page ' + currentPage);
        currentPage++;
    }
}

async function run(callback){
    loader.style.display = "block";
    previous.style.display = "none";
    next.style.display = "none";
    const data = await getPages(1).then(callback);
    loader.style.display = "none";
    previous.style.display = "inline-block";
    next.style.display = "inline-block";
}

run(renderPeopleData);

next.addEventListener('click', ()=>{
    if (page < 80) {
        page == result.length - 10 ? (page = 0) : (page+=10);
        renderPeopleData();
    }
})

previous.addEventListener('click', ()=>{
    if (page > 0) {
        page == 0 ? (page = result.length - 10) : (page-=10);
        renderPeopleData();
    }
})

function renderPeopleData(){
    removeAllChildNodes(nameList)

    for (let i = page; i <= page + 9; i++) {
        let character = result[i];
        if (character !== undefined){
            const liElement = document.createElement('li');
            liElement.textContent = character.name;
    
            liElement.addEventListener("click", function(){
                details.textContent = "";
                h2Detail.textContent = "Details";
                let wantedList = ["name", "height", "mass", "hair_color", "skin_color", "eye_color", "birth_year", "gender"];
                for (let [key, value] of Object.entries(character)){
                    if (wantedList.includes(key)) {
                        const pElement = document.createElement('p');
                        if (value == "n/a") {
                            value = "none";
                        }
                        if (key == "height") {
                            pElement.textContent = (key.replace("_"," ") + ": " + value + " cm");
                        }
                        else if (key == "mass" && value != "unknown") {
                            pElement.textContent = (key.replace("_"," ") + ": " + value + " kg");
                        }
                        else{
                            pElement.textContent = (key.replace("_"," ") + ": " + value);
                        }
                        details.appendChild(pElement);
                    }
                }
            });
    
            nameList.appendChild(liElement);
        }
    }
}

function removeAllChildNodes(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
