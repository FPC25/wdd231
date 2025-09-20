function cleanDisplay(functionName, companiesElement){
    companiesElement.innerHTML = '';
    let add;
    let remove;
    if (functionName === "displayCard" ){
        add = "grid";
        remove = "list";
    }
    else if (functionName === "displayList"){
        add = "list";
        remove = "grid";
    }
    companiesElement.classList.add(add);
    companiesElement.classList.remove(remove);
}

export function displayCompanies(companiesList, displayOption, companiesElement, clean = false) {
    if (clean === true) {
        cleanDisplay(displayOption.name, companiesElement);
    }
    
    companiesList.forEach((company) => {
        let card = displayOption(company);
        companiesElement.appendChild(card);
    });
}