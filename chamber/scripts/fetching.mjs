// Fetching OpenWeather info
export async function apiFetch(url, display) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            display(data);
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}