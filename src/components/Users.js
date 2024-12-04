import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingUser, setEditingUser] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to access this page.');
      navigate('/'); // Redirect to login page if no token
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
        const fetchedUsers = response.data.data;

        const updatedUsers = fetchedUsers.map(user => {
          const storedUser = localStorage.getItem(`user_${user.id}`);
          return storedUser ? JSON.parse(storedUser) : user;
        });

        setUsers(updatedUsers);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id)); 
      localStorage.removeItem(`user_${id}`); 
      alert('User deleted successfully');
    } catch (error) {
      console.error(error);
      alert("Error in deleting the user: " + error.message);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user); // Set the user to be edited
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://reqres.in/api/users/${editingUser.id}`, {
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
      });
  
      // Merge the existing user data with the updated data, keeping the avatar
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...response.data, avatar: user.avatar } // Keep the avatar
          : user
      ));
  
      // Save changes to local storage
      localStorage.setItem(`user_${editingUser.id}`, JSON.stringify({
        ...editingUser,
        avatar: users.find(user => user.id === editingUser.id).avatar,
      }));
  
      // Close edit form
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  return (
    <div className="main-container">
      <h1 className="page-title">Users</h1>
      <div className="user-grid">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <img className="user-avatar" src={user.avatar} alt={user.first_name} />
            <div className="user-info">
              <h2 className="user-name">
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ margin: "20px 10px" }}>{user.email}</p>
              <div className="user-actions">
                <button className="edit-button" onClick={() => handleEditClick(user)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editingUser && (
        <div className="edit-modal">
          <form className="edit-form" onSubmit={handleEditSubmit}>
            <h2>Edit User</h2>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={editingUser.first_name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={editingUser.last_name}
                onChange={handleEditChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleEditChange}
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
