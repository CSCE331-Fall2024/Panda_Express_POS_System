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
      return {
        temperature: data.main.temp, // Fahrenheit
        description: data.weather[0].description,
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