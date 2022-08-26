import RestaurantList from "./RestaurantList";
import getRestaurantData from "../api";
import { useEffect, useState } from "react";

export default function RestaurantView() {
  const [restaurants, setRestaurants] = useState(null);
  const fetch = async () => {
    try {
      const _restaurants = await getRestaurantData();
      // setRestaurants(_restaurants);
      console.log(_restaurants);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    fetch();
  }, [])

  return <RestaurantList />
}