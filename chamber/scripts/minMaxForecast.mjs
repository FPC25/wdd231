function getWeekday(Date){
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return daysOfWeek[Date.getDay()];
}

function getForecastObj(Date) {
    return {
        Date: Date.toISOString().split("T")[0], // YYYY-MM-DD date
        weekday: getWeekday(Date)
    };
}

export function getMinMax(data){
    let today = new Date();
    let tomorrow = new Date();
    let after = new Date();
    let afterAfter = new Date();

    tomorrow.setDate(today.getDate() + 1);
    after.setDate(today.getDate() + 2);
    afterAfter.setDate(today.getDate() + 3);

    let daysToForecast = [getForecastObj(tomorrow),getForecastObj(after), getForecastObj(afterAfter)];


    daysToForecast.forEach(day => {
        let min = Infinity;
        let max = -Infinity; 
        const forecasts = data.list;

        for (let i = 0; i < forecasts.length; i++) {
            let forecastDate = forecasts[i].dt_txt.split(" ")[0];

            if (forecastDate === day.Date) {
                const main = forecasts[i].main;
                min = Math.min(min, main.temp_min);
                max = Math.max(max, main.temp_max);
            }
        };

        day.min_temp = parseInt(min);
        day.max_temp = parseInt(max);
    });

    return daysToForecast;
}