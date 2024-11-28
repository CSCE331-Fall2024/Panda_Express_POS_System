// Getting the weather based on lat and lon
export const getWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/weather?lat=${latitude}&lon=${longitude}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      // Extract hours and minutes for sunrise and sunset
      const extractTime = (timestamp) => ({
        hours: Math.floor(timestamp / 100),
        minutes: timestamp % 100,
      });

      const { hours: sunriseHours, minutes: sunriseMinutes } = extractTime(
        Math.floor(data.sys.sunrise / 1000000) // Hour[0:2] Minute[2:4]
      );
      const { hours: sunsetHours, minutes: sunsetMinutes } = extractTime(
        Math.floor(data.sys.sunset / 1000000) // Hour[0:2] Minute[2:4]
      );

      // Get the current time in UTC
      const now = new Date();
      const currentHours = now.getUTCHours();
      const currentMinutes = now.getUTCMinutes();

      // Determine if it's day or night
      const isDay =
      currentHours > sunriseHours ||
      (currentHours === sunriseHours && currentMinutes >= sunriseMinutes) &&
      (currentHours < sunsetHours ||
        (currentHours === sunsetHours && currentMinutes < sunsetMinutes));
      return {
        temperature: data.main.temp, // Fahrenheit
        description: data.weather[0].description,
        isDay, // true if it's day, false if it's night
      };
    } catch (error) {
      console.error("Error in getWeatherData:", error);
      throw error;
    }
  };

// Getting the user's location
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    reject(null);
                },
                { enableHighAccuracy: true }
            );
        } else {
            console.error("Geolocation not supported by this browser.");
            resolve(null); // Return null if geolocation is not supported
        }
    });
};