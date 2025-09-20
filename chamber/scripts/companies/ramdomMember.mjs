export function randomMember(list, count) {
    let selected = [];
    let copy = [...list]; // Faz uma cópia da lista para não alterar a original

    while (selected.length < count && copy.length > 0) {
        let randomIndex = Math.floor(Math.random() * copy.length); // Gera um índice aleatório
        selected.push(copy[randomIndex]); // Adiciona o número correspondente ao índice
        copy.splice(randomIndex, 1); // Remove o número da lista para evitar duplicatas
    }

    return selected;
}