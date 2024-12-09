import { City, Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { Card, Selector } from "../components";
import { Form } from "react-router-dom";
import axios from "axios";

const App = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  let countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState();
  const [cityData, setCityData] = useState();

  const [country, setCountry] = useState(countryData[100]);
  const [state, setState] = useState();
  let [city, setCity] = useState();

  const [vendors, setVendors] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  // wheneven the country and state change then state and city data will set
  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode));
  }, [country]);

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  }, [state]);

  //to intialise state
  useEffect(() => {
    stateData && setState(stateData[0]);
  }, [stateData]);

  //to initailse city
  useEffect(() => {
    cityData && setCity(cityData[0]);
  }, [cityData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    city = city.name;
    axios
      .post(`${baseUrl}/users/search`, {
        country,
        state,
        city,
      })
      .then((res) => {
        console.log("Searched vendors: ", res.data);
        setVendors(res.data.data);
        setSearchClicked(true);
      })
      .catch((err) => console.log("search failed: ", err));
  };

  useEffect(() => {
    if (!searchClicked) {
      axios
        .get(`${baseUrl}/users/all-vendors`)
        .then((res) => {
          console.log("List of all vendors: ", res.data);
          setVendors(res.data.data);
        })
        .catch((err) => console.log(err));
    }
  }, [searchClicked]);

  return (
    <>
      <section className=" px-3 py-8 grid place-items-center bg-base-200 bg-[url('/img/bg/search-bg.png')]">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center font-jost">
            Find the vendor who is best fit for your wedding functions
          </h1>
          <form className="flex flex-wrap gap-3 bg-teal-600 rounded-lg p-6 justify-center md:justify-start">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <p className="text-black text-xl font-semibold">Country :</p>
              <Selector
                className="bg-white text-black"
                data={countryData}
                selected={country}
                setSelected={setCountry}
              />
            </div>
            {state && (
              <div className="w-full md:w-1/2 lg:w-1/4">
                <p className="text-black text-xl font-semibold">State :</p>
                <Selector
                  className="bg-white text-black"
                  data={stateData}
                  selected={state}
                  setSelected={setState}
                />
              </div>
            )}
            {city && (
              <div className="w-full md:w-1/2 lg:w-1/3">
                <p className="text-black text-xl font-semibold">City :</p>
                <Selector
                  className="bg-white text-black"
                  data={cityData}
                  selected={city}
                  setSelected={setCity}
                />
              </div>
            )}
            <div className="w-full flex justify-center md:justify-center ">
              <button
                className="text-white bg-blue-500 hover:bg-blue-800 hover:text-white rounded-full px-10 py-2.5 text-xl"
                type="submit"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3  bg-[url('/img/bg/search-bg.png')] ">
        {vendors.length > 0 &&
          vendors.map((list) => (
            <Card
              key={list._id}
              _id={list._id}
              name={list.name}
              email={list.email}
              images={list.images}
              city={list.city}
              contact={list.contact}
              price={list.price}
              description={list.description}
            />
          ))}
      </div>
    </>
  );
};

export default App;
