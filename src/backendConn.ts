import axios from 'axios';
import type { Flight } from './interfaces/Flight.ts';

const bckndApiUrl = import.meta.env.VITE_BACKEND_API_URL;

async function getFlights(){
    // try {
        const response = await axios.get(bckndApiUrl+"/Flights");
        // console.log(response.data);
        return response.data;
    // } catch (error) {
    //     console.error(error);
    // }
}

async function createFlight(vuelo : Flight){
    // try {
        console.log(vuelo);
        var count = (await getFlights()).length;
        // console.log("count: ", count);
        vuelo.id = count + 1;
        const response = await axios.post(bckndApiUrl+"/Flights", vuelo);
        return response;
    // } catch (error) {
    //     console.error(error);
    // }      
}

export { getFlights, createFlight }