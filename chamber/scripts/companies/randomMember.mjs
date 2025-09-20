export function randomMember(list, count) {
    let selected = [];
    let copy = [...list]; // Makes a copy of the list to avoid altering the original

    while (selected.length < count && copy.length > 0) {
        let randomIndex = Math.floor(Math.random() * copy.length); // Generates a random index
        selected.push(copy[randomIndex]); // Adds the number corresponding to the index
        copy.splice(randomIndex, 1); // Removes the number from the list to avoid duplicates
    }

    return selected;
}