const url = 'https://fpc25.github.io/wdd231/chamber/data/members.json';

export async function getCompanyData() {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}