import React, { useEffect, useState } from "react";
import { url } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let userId = window.localStorage.getItem("user-id");
    try {
      const request = await axios.get(`${url}/user/${userId}`, {
        headers: {
          Authorization: window.localStorage.getItem("access-token"),
        },
      });
      if (request.data.status === 200) {
        setUserData([request.data.user]);
      }
      if (request.data.status === 401) {
        await getNewAccessToken();
      }
      if (request.data.status === 404) {
        window.alert(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getNewAccessToken = async () => {
    try {
      const request = await axios.post(`${url}/new/token`, {
        refresh_token: window.localStorage.getItem("refresh-token"),
      });
      if (request.data.status === 200) {
        window.localStorage.setItem("refresh-token", request.data.refresh);
        window.localStorage.setItem("access-token", request.data.access);
        await getData();
      }
      if (request.data.status === 401) {
        window.alert(request.data.message);
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const request = await axios.delete(`${url}/delete/user/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem("access-token"),
        },
      });
      if (request.data.status === 200) {
        window.alert(request.data.message);
        window.localStorage.clear();
        navigate("/sign-up");
      }
      if (request.data.status === 401) {
        navigate("/sign-in");
      }
      if (request.data.status === 403) {
        window.alert(request.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {userData &&
        userData.map((item, index) => (
          <div className="container mx-auto" key={index}>
            <div className="w-80 flex flex-col items-center gap-y-4 mt-8 border border-2 rounded-md p-4 border-green-800">
              <h3>
                Name :{" "}
                <span className="text-sky-500 font-semibold">{item.name}</span>
              </h3>
              <p>
                Email :{" "}
                <span className="text-sky-500 font-semibold">{item.email}</span>
              </p>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        ))}
    </>
  );
}

export default Dashboard;
