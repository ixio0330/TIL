import { useState } from "react";
import axios from 'axios';
import { useEffect } from "react";

export default function UserProfile({ id }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const getUser = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUser(id);
  }, [id]);

  if (loading) return <div>Loading...</div>
  if (!userData) return <div>No data.</div>
  const { username, email } = userData;
  return (
    <div>
      <p>
        <b>Username: </b>
        <span>{username}</span>
      </p>
      <p>
        <b>Email: </b>
        <span>{email}</span>
      </p>
    </div>
  );
}