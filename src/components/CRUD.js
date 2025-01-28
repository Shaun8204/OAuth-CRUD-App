import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  Box,
  Switch,
} from "@mui/material";

const CRUD = ({ users, setUsers }) => {
  const [newItem, setNewItem] = useState({
    name: "",
    id: "",
    githubId: "",
    active: false,
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    id: "",
    githubId: "",
  });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users"));
    if (savedUsers) {
      setUsers(savedUsers);
    }
  }, [setUsers]);

  const updateLocalStorage = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.id || !newItem.githubId) {
      alert("All fields are required!");
      return;
    }

    const isDuplicateId = users.some((user) => user.id === newItem.id);
    if (isDuplicateId) {
      alert("The ID must be unique. Please enter a different ID.");
      return;
    }

    const updatedUsers = [...users, newItem];
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setNewItem({ name: "", id: "", githubId: "", active: false });
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewItem(users[index]);
  };

  const handleUpdate = () => {
    const isDuplicateId = users.some(
      (user, index) => user.id === newItem.id && index !== editIndex
    );
    if (isDuplicateId) {
      alert("The ID must be unique. Please enter a different ID.");
      return;
    }

    const updatedUsers = users.map((user, index) =>
      index === editIndex ? newItem : user
    );
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setNewItem({ name: "", id: "", githubId: "", active: false });
    setEditIndex(null);
  };

  const handleSearch = (key, value) => {
    setSearchFilters({ ...searchFilters, [key]: value });
  };

  const handleDetails = (user) => {
    alert(
      `Details:\nName: ${user.name}\nID: ${user.id}\nGitHub ID: ${
        user.githubId
      }\nActive: ${user.active ? "Yes" : "No"}`
    );
  };

  const handleCopy = (user) => {
    const copiedUser = { ...user, id: `${user.id}_copy` };
    const updatedUsers = [...users, copiedUser];
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
  };

  const handleToggleActive = (index) => {
    const updatedUsers = users.map((user, i) =>
      i === index ? { ...user, active: !user.active } : user
    );
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
  };

  const filteredUsers = users.filter((user) =>
    Object.keys(searchFilters).every((key) =>
      user[key]?.toLowerCase().includes(searchFilters[key].toLowerCase())
    )
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        User Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search Name"
                  onChange={(e) => handleSearch("name", e.target.value)}
                  sx={{ mt: 1, width: "100%" }}
                />
              </TableCell>
              <TableCell>
                <strong>ID</strong>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search ID"
                  onChange={(e) => handleSearch("id", e.target.value)}
                  sx={{ mt: 1, width: "100%" }}
                />
              </TableCell>
              <TableCell>
                <strong>GitHub ID</strong>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search GitHub ID"
                  onChange={(e) => handleSearch("githubId", e.target.value)}
                  sx={{ mt: 1, width: "100%" }}
                />
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
              <TableCell>
                <strong>Active</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.githubId}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(index)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(index)}
                    sx={{ mr: 1 }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => handleDetails(user)}
                    sx={{ mr: 1 }}
                  >
                    Details
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleCopy(user)}
                  >
                    Copy
                  </Button>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.active}
                    onChange={() => handleToggleActive(index)}
                    color="primary"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 3 }}>
        {editIndex !== null ? "Edit User" : "Add New User"}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <TextField
          label="Name"
          variant="outlined"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <TextField
          label="ID"
          variant="outlined"
          value={newItem.id}
          onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
        />
        <TextField
          label="GitHub ID"
          variant="outlined"
          value={newItem.githubId}
          onChange={(e) => setNewItem({ ...newItem, githubId: e.target.value })}
        />
        {editIndex !== null ? (
          <Button variant="contained" color="success" onClick={handleUpdate}>
            Update
          </Button>
        ) : (
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CRUD;
