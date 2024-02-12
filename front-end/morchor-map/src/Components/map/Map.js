import "./Map.css";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import { Marker } from "@vis.gl/react-google-maps";

export const MapCon = ({
  latitude,
  longitude,
  userOrLocation,
  submit,
  selectFaculty,
  setUseRoute,
  setDestinationLat,
  setDestinationLng,
}) => {
  const [location, setLocation] = useState([]);
  const [check, setChecked] = useState([]);


  const loadBuilding = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:5000/api/locations/one-name", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setChecked(false);
        setLocation(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    loadBuilding();
  }, []);

  const showAllLocation = () => {
    if (!check) {
      if (
        submit &&
        userOrLocation !== "user" &&
        latitude !== "" &&
        longitude !== ""
      ) {
        return (
          <>
            {location.map((marker) => {
              if (
                parseFloat(marker.latitude) === latitude &&
                parseFloat(marker.longitude) === longitude
              ) {
                const position = {
                  lat: parseFloat(marker.latitude),
                  lng: parseFloat(marker.longitude),
                };
                return (
                  <>
                    <Marker
                      position={position}
                      onClick={() => {
                        setUseRoute(true)
                        setDestinationLat(marker.latitude)
                        setDestinationLng(marker.longitude)
                      }}
                    ></Marker>
                  </>
                );
              }
            })}
          </>
        );
      } else if (selectFaculty === "") {
        return (
          <>
            {location.map((marker) => {
              const position = {
                lat: parseFloat(marker.latitude),
                lng: parseFloat(marker.longitude),
              };
              return (
                <>
                  <Marker
                    position={position}
                    onClick={() => {
                      alert(marker.locationName);
                    }}
                  ></Marker>
                </>
              );
            })}
          </>
        );
      } else {
        return (
          <>
            {location
              .filter((cate) => cate.category == selectFaculty)
              .map((marker) => {
                const position = {
                  lat: parseFloat(marker.latitude),
                  lng: parseFloat(marker.longitude),
                };
                return (
                  <>
                    <Marker
                      position={position}
                      onClick={() => {
                        alert(marker.locationName);
                      }}
                    ></Marker>
                  </>
                );
              })}
          </>
        );
      }
    }
  };

  useEffect(() => {
    showAllLocation();
  }, [latitude, longitude, userOrLocation, submit, selectFaculty]);

  return <>{showAllLocation()}</>;
};
