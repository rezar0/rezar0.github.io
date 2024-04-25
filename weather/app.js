document.getElementById('zipcode-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally
    const inputZipcode = document.getElementById('zipcode-input').value;

    fetch('./zipcodes.json')
        .then(response => response.json())
        .then(data => {
            const zipEntry = data.find(zip => zip.zipcode == inputZipcode);
            if (zipEntry) {
                fetchWeatherData(zipEntry.latitude, zipEntry.longitude);
                fetchWeatherToday(zipEntry.latitude, zipEntry.longitude);
            } else {
                displayResults("No data found for this zipcode.");
            }
        })
        .catch(error => console.error('Error loading the JSON file:', error));
});
var weatherData = {};
var dailyWeatherData = {};
var historicalDates;
var yearAverages = {};
var dataByYear;
var todaysHigh = 66.5;
var response;

function fetchWeatherToday(latitude, longitude) {
    
    const apiDailyUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&temperature_unit=fahrenheit&forecast_days=1&timezone=auto`;

    fetch(apiDailyUrl)
        .then(response => response.json())
        .then(data => {
            dailyWeatherData = data;
            todaysHigh = dailyWeatherData.daily.temperature_2m_max[0];
        })
        .catch(error => console.error('Error fetching weather data:', error));
}


function fetchWeatherData(latitude, longitude) {
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 80);
    pastDate.setDate(pastDate.getDate() - 15);
    const pastDateString = pastDate.toISOString().split('T')[0];

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 2);
    const currentDateString = currentDate.toISOString().split('T')[0];

    const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${pastDateString}&end_date=${currentDateString}&daily=temperature_2m_max&temperature_unit=fahrenheit`;



    //fetch(apiUrl)
    fetch('./rawData.json')
        .then(response => response.json())
        .then(data => {
            weatherData = data;
            
            historicalDates = generateDateRanges();

            dataByYear = weatherDataByYearFunction();

            yearVariousData = getYearAveragesMaxExact(dataByYear);

            averageWithTrendlineChart(buildChartData(yearVariousData, 2), buildChartData(yearVariousData, 3))
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function generateDateRanges() {
    const today = new Date();
    let result = {};

    for (let year = 1; year <= 80; year++) {
        // Adjusting year based on the current date
        const baseDate = new Date(today);
        baseDate.setFullYear(today.getFullYear() - year);

        // Check for leap day and adjust if the base year is not a leap year
        if (today.getMonth() === 1 && today.getDate() === 29) {
            // Set date to February 29 of the base year
            baseDate.setMonth(1);
            baseDate.setDate(29);
            // If setting February 29 results in the date rolling to March, then adjust
            if (baseDate.getMonth() !== 1) {
                baseDate.setMonth(2);
                baseDate.setDate(1);
            }
        }

        const datesArray = [];
        // Add dates from 3 days before to 3 days after
        for (let day = -4; day < 3; day++) {
            const dateCopy = new Date(baseDate);
            dateCopy.setDate(baseDate.getDate() + day);
            datesArray.push(dateCopy.toISOString().split('T')[0]);
        }

        result[baseDate.getFullYear()] = datesArray;
    }

    return result;
}

function weatherDataByYearFunction() {
    const weatherDataByYear = {};

    // Iterate over the years in historicalDates
    for (let i = 0; i < Object.keys(historicalDates).length; i++) {
        const year = Object.keys(historicalDates)[i];
        weatherDataByYear[year] = [];  // Initialize an empty array for each year

        // Iterate over the dates for each year
        for (let j = 0; j < historicalDates[year].length; j++) {
            const date = historicalDates[year][j];
            const temperatureIndex = weatherData.daily.time.indexOf(date);

            // Check if the date exists in the weather data
            if (temperatureIndex !== -1) {
                weatherDataByYear[year].push(weatherData.daily.temperature_2m_max[temperatureIndex]);
            } else {
                weatherDataByYear[year].push(null); // Append null if the date isn't found
            }
        }
    }
    return weatherDataByYear;
}


function getAvg(numbers) {
    if (numbers.length === 0) return
    return numbers.reduce((acc, c) => acc + c, 0) / numbers.length;
}


function calculateTrendline(data) {
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    const n = data.length;

    // Calculate sums of x, y, xy, and x^2
    for (let i = 0; i < n; i++) {
        const x = i + 1;  // x values are 1-based index of array
        const y = data[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    // Calculate the slope (a) and intercept (b)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate trendline data
    const trendline = [];
    for (let i = 0; i < n; i++) {
        const x = i + 1;
        const trendY = slope * x + intercept;
        trendline.push(trendY);
    }
    var holder = [];
    for (let i = 0; i < trendline.length; i++){
        if ((i === 0) || (i + 1) === trendline.length) {
            holder.push(trendline[i]);
        } else {
            holder.push(' ');
        }
    }

    return trendline;
}

function buildChartData(dataset, place) {
    let result = [];
    for (const [key, value] of Object.entries(dataset)) {
        result.push(value[place]);
    }
    return result;
}



function getYearAveragesMaxExact(data) {
    let result = {};
    const entries = Object.entries(data); // Convert object to array of key-value pairs
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        result[key] = []; // Initialize array for each key
        result[key].push(getAvg(value)); // Assuming getAvg is defined to calculate average
        result[key].push(Math.max(...value)); // Maximum value in the array
        result[key].push(value[3]); // The date of the value
        if ((i + 1) % 10 === 1) { // Check if the position is divisible by 8 (1-based index)
            result[key].push(key); // Add the key itself
        } else {
            result[key].push(null); // Add a blank (null)
        }
    }
    result["2024"] = [todaysHigh, todaysHigh, todaysHigh, '2024'];
    console.log(result)
    return result;
}

function averageWithTrendlineChart(value, labels) {
    var data = {
        // A labels array that can contain any sort of values
        labels: labels,
        // Our series array that contains series objects or in this case series data arrays
        series: [
            value,
            calculateTrendline(value)
        ]
    };

    var options = {
        showPoint: false,
         width: '800px',
        height: '400px',
      };

    new Chartist.Line('.ct-chart', data, options);
}
