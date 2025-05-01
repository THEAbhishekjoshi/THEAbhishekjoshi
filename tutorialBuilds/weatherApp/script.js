const apikey = "***REMOVED***";
const form = document.querySelector(".weatherForm");
const Card = document.querySelector(".card");

// form.addEventListener("submit", function (event) {
//   event.preventDefault(); // prevent page reload

//   // ⬇️ Get the value inside the event handler
//   const city = document.querySelector(".cityInput").value;

//   fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
//     .then(response => {
//       if (!response.ok) throw new Error("City not found");
//       return response.json();
//     })
//     .then(data => console.log(data))
//     .catch(error => console.log("Error:", error));
// });
//
async function getinfo(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);
    if(!response.ok){
        throw new Error("couldn't fetch");
    }
    return await response.json();
};

form.addEventListener("submit", async event =>{
    event.preventDefault();
    const city = document.querySelector(".cityInput").value;
    if(city){
        try{
            const data = await getinfo(city);  // 🔄 async function — needs await
            Display(data);                     // ✅ sync function — NO await needed
        }
        catch(error){
            console.log(error);
            displayError(error);
        }
        
    }
    else{
        displayError("Please Enter City");
    }
})
function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent=message;
    //add css to it 
    errorDisplay.classList.add("errorDisplay");

    Card.textContent="";
    Card.style.display="flex";
    Card.appendChild(errorDisplay);
    //Card.style.display="none";

}
function Display(data){
   Card.textContent="";
   Card.style.display="flex";
   console.log(data);
   //you can also use this
///   const {name: city, main: {temp,humidity},weather:[{description,id}]}=data;
   
   //Display a city
   const cityDisplay= document.createElement("h1");
   cityDisplay.textContent=data.name;
   cityDisplay.classList.add("cityDisplay");
   Card.appendChild(cityDisplay);
   //Display a temperature
   const tempDisplay= document.createElement("p");
   tempDisplay.textContent=`${data.main['temp'].toFixed(1)}°C`;
   tempDisplay.classList.add("tempDisplay");
   Card.appendChild(tempDisplay);
   //Display Humidity
   const humidityDisplay= document.createElement("p");
   humidityDisplay.textContent=`Humidity:${data.main['humidity']}%`;
   humidityDisplay.classList.add("humidityDisplay");
   Card.appendChild(humidityDisplay);
   //Display description
   const descDisplay= document.createElement("p");
   descDisplay.textContent=`${data.weather[0]['description']}`;
   descDisplay.classList.add("descDisplay");
   Card.appendChild(descDisplay);
   //Weather emoji
   const weatherEmoji= document.createElement("p");
   //weatherEmoji.textContent=`${data.weather[0]['icon']}`;
   weatherEmoji.textContent= getWeatherEmoji(data.weather[0]['id']);
   weatherEmoji.classList.add("weatherEmoji");
   Card.appendChild(weatherEmoji);
}
function getWeatherEmoji(id){
    switch(true){
        case(id >= 200 && id<300):
            return "🌧️";
        case(id >= 300 && id<400):
            return "🌧️";
        case(id >= 500 && id<600):
            return "🌧️";
        case(id >= 600 && id<700):
            return "❄️";
        case(id >= 700 && id<800):
            return " 🌫️";
        case(id === 800):
            return "☀️";
        case(id >= 801 && id< 810):
            return "☁️";
        default:
            return "❓";
    }
}




