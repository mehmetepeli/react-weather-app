import './App.css';
import axios from "axios";
import {useEffect, useState} from "react";
// const API_KEY = process.env.API_KEY;
const API_KEY = "8329121f48864985914183513233103";

const App = () => {
    const [location,setLocation] = useState('London');
    const [localDate, setLocalDate] = useState('');
    const [locationDetails, setLocationDetails] = useState({});
    const [currentWeather,setCurrentWeather] = useState({});
    const [nextDaysWeather, setNextDaysWeather] = useState([]);
    const [timeDetails, setTimeDetails] = useState({});

    const getDayName = (dateStr, locale) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(locale, { weekday: 'short' });
    }

    const customDate = (dateStr, locale) => {
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString(locale, { weekday: 'long' });
        const day = date.getDate();
        const month = date.toLocaleDateString(locale, { month: 'long' });
        const year = date.getFullYear();
        return dayName+' , '+day+' '+month+' '+year;
    }

    useEffect(() => {
        const getCityWeather = async() => {
            const response = await axios.get("http://api.weatherapi.com/v1/forecast.json?key="+API_KEY+"&q="+location+"&days=7&aqi=no&alerts=no");
            try {
                const res = response.data;

                setLocalDate(res.location.localtime);
                setCurrentWeather({
                    icon: res.current.condition.icon,
                    text: res.current.condition.text,
                    degree: res.current.feelslike_c
                });
                setLocationDetails({
                    country: res.location.country,
                    city: res.location.name,
                    time_zone: res.location.tz_id,
                    lat: res.location.lat,
                    lon: res.location.lon,
                });
                setNextDaysWeather(res.forecast.forecastday);
            } catch (e) {
                console.log(e.message);
            }
        }

        const getCustomTime = (timeZone) => {
            const date = new Date();
            const time = date.toLocaleTimeString('en-US', { timeZone: timeZone });
            setTimeDetails({
                time: time.slice(0,-6),
                timeType: time.slice(-2)
            });
        }

        getCityWeather();
        getCustomTime(locationDetails.time_zone);

    }, [location]);


  return (
    <div id="weather-app-total-container">
        <div id="weather-app-container">
            <div className="weather-today-container">
                <div className="wtc-left">
                    <div id="clock-container">
                        {timeDetails.time} <span>{timeDetails.timeType}</span>
                    </div>
                    <div id="date-container">
                        {customDate(localDate.split(" ")[0], "en-EN")}
                    </div>
                </div>
                <div className="wtc-right">
                    <div className="currentLocation">
                        <h1 className="city">{locationDetails.city}</h1>
                        <h1 className="country">{locationDetails.country}</h1>
                    </div>
                    <form id="chooseLocation">
                        <input type="text" id="cityName" placeholder="City" onChange={(e) => setLocation(e.target.value)}/>
                    </form>
                </div>
            </div>
            <div className="weather-days-container">
                <div className="wdc-row">
                    <div className="today-icon">
                        <img src={currentWeather.icon} alt="Icon"/>
                    </div>
                    <div className="today-desc">
                        <h5 className="title">TODAY</h5>
                        <span className="degree">{Math.round(currentWeather.degree)}°</span>
                    </div>
                </div>
                {
                    nextDaysWeather.slice(1).map((item) => (
                        <div className="wdc-row">
                            <div className="wd-title">{getDayName(item.date, 'en-EN')}</div>
                            <div className="wd-icon">
                            <img src={item.day.condition.icon} alt="Icon"/>
                            </div>
                            <div className="wd-degree">{Math.round(item.day.avgtemp_c)}°</div>
                        </div>
                    ))
                }
            </div>
        </div>
    </div>
  );
}

export default App;
