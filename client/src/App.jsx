import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

function App() {
  const[users, setUsers] = useState([]);
  const[filterUsers, setfilterUsers] = useState([]);
  const[ifModelopen, setifModelopen] = useState(false);
  const[userData, setUserData] = useState({name:"", age:"", city:""});
  

  const getAllUsers = async () => {
    await axios.get("http://localhost:8000/users").then
    ((res) => {
      console.log(res.data);
      setUsers(res.data);
      setfilterUsers(res.data);
    });
  };

  useEffect(() => {
    getAllUsers();
  },[]);

  const searchHandler = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchText));
    setfilterUsers(filteredUsers);
  };

  const closeModel = () =>{
    setifModelopen(false);
    getAllUsers();
  };

  const handleData = (e) =>{
    setUserData({...userData,[e.target.name]:e.target.value});
  };
  
  const HandleAddrecord = () => {
    setUserData({name:"", age:"", city:""});
    setifModelopen(true);
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    if (userData.id) {
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res) => {
        console.log(res);
      });
    }
    else{
      await axios.post("http://localhost:8000/users",userData).then((res) => {
        console.log(res);
      });
    };
    closeModel();
    setUserData({name:"", age:"", city:""});
  };

  const handleEditrecord = (user) =>{
    setUserData(user);
    setifModelopen(true);
  };

  const handleDelete = async (id) => {
    const ifConfirmed = window.confirm("Are you sure you want to delete it?");
    if (ifConfirmed){
      await axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
        setUsers(res.data);
        setfilterUsers(res.data);
    });
    }
  };

  return (
    <>
      <div className="container">
        <h1>My crud application</h1>
        <div className="input-search">
          <input type="search" placeholder="search here"
          onChange={searchHandler}/>
          <button className="btn green" onClick={HandleAddrecord}>add record</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers && filterUsers.map((user,index) => {
              return(
              <tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className="btn green" onClick={()=> handleEditrecord(user)}>edit</button></td>
                <td><button className="btn" onClick={() => handleDelete(user.id)}>delete</button></td>
              </tr>
              );
            })}
          </tbody>
        </table>
        {ifModelopen && (<div className="model">
          <div className="modelContent">
            <span className="close" onClick={closeModel}>&times;</span>
            <h2>User record</h2>
            <div className="input-group">
              <label htmlFor="name">name</label>
              <input type="text" name="name" id="name" value={userData.name} onChange={handleData}></input>
            </div>
            <div className="input-group">
              <label htmlFor="age">age</label>
              <input type="number" name="age" id="age" value={userData.age} onChange={handleData}></input>
            </div>
            <div className="input-group">
              <label htmlFor="city">city</label>
              <input type="text" name="city" id="city" value={userData.city} onChange={handleData}></input>
            </div>
            <button className="btn green" onClick={handleSubmit}>add user</button>
          </div>
          </div>)}
      </div>
    </>
  );
}

export default App;
