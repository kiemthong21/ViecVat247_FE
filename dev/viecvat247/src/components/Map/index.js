import React, { memo, useEffect, useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import ManIcon from "@mui/icons-material/Man";
import GoogleMapReact from "google-map-react";
import { geocodeByLatLng, getLatLng, geocodeByPlaceId } from "react-google-places-autocomplete";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Button } from "antd";

const Position = ({ icon }) => <div>{icon}</div>;

const Map = ({ onLocationChange }) => {
    const [coords, setCoords] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        const getCoords = async () => {
            const result = await geocodeByPlaceId(address.value.place_id);
            const latLng = await getLatLng(result[0]);
            setCoords(latLng);
            onLocationChange({ label: address.label, lat: latLng.lat, lng: latLng.lng });
        };
        if (address) {
            getCoords();
            console.log(address.value.place_id);
        } else {
            navigator.geolocation.getCurrentPosition(({ coords: { longitude, latitude } }) => {
                setCoords({ lat: latitude, lng: longitude });
            });
        }
    }, [address]);

    const handleGetCurrentLocation = async () => {
        navigator.geolocation.getCurrentPosition(async ({ coords: { longitude, latitude } }) => {
            await setCoords({ lat: latitude, lng: longitude });
            geocodeByLatLng({ lat: latitude, lng: longitude }).then((results) => onLocationChange({ label: results[0].formatted_address, lat: latitude, lng: longitude }));
        });
    };

    return (
        <div style={{ height: "385px", width: "100%", position: "relative" }} className="mb-5">
            <div className="mt-2 mb-2">
                <GooglePlacesAutocomplete
                    selectProps={{
                        address,
                        onChange: setAddress,
                    }}
                />
            </div>
            <Button
                className="text-center"
                style={{ position: "absolute", bottom: 65, right: 10, zIndex: "50", width: "40px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={handleGetCurrentLocation}
            >
                <ManIcon />
            </Button>
            <GoogleMapReact bootstrapURLKeys={{ key: "AIzaSyDwsRext0BNh0tlie4NALIXT2zYc9bzfn8" }} defaultCenter={coords} defaultZoom={11} center={coords}>
                <Position center={coords} lat={coords?.lat} lng={coords?.lng} icon={<PlaceIcon style={{ color: "red", fontSize: "24px" }} />} />
            </GoogleMapReact>
        </div>
    );
};

export default memo(Map);
