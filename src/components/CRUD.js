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
} from "@mui/material";

const CRUD = ({ users, setUsers }) => {
  const [newItem, setNewItem] = useState({ name: "", id: "", githubId: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Load user data from localStorage on component mount
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

    // Check for unique ID
    const isDuplicateId = users.some((user) => user.id === newItem.id);
    if (isDuplicateId) {
      alert("The ID must be unique. Please enter a different ID.");
      return;
    }

    const updatedUsers = [...users, newItem];
    setUsers(updatedUsers);
    updateLocalStorage(updatedUsers);
    setNewItem({ name: "", id: "", githubId: "" });
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
    // Check for unique ID if it's being edited
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
    setNewItem({ name: "", id: "", githubId: "" });
    setEditIndex(null);
  };

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
              </TableCell>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>GitHub ID</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
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
                  >
                    Delete
                  </Button>
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
