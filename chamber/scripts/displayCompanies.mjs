function cleanDisplay(name){
    companies.innerHTML = '';
    let add;
    let remove;
    if (name === "displayCard" ){
        add = "grid";
        remove = "list";
    }
    else if (name === "displayList"){
        add = "list";
        remove = "grid";
    }
    companies.classList.add(add);
    companies.classList.remove(remove);
}

export function displayCompanies(companiesList, displayOption, clean = false) {
    if (clean === true) {
        cleanDisplay(displayOption.name);
    }
    
    companiesList.forEach((company) => {
        let card = displayOption(company);
        companies.appendChild(card);
    });
}