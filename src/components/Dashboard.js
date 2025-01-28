import React, { useState, useEffect, useCallback } from "react";
import DataGrid, { Column, Toolbar, Item } from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css"; // DevExtreme CSS
import dataJson from "../data/data.json";
import { deleteCookie } from "../utils/cookieUtils";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTheme, ThemeProvider, CssBaseline, Button } from "@mui/material";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchGithubId, setSearchGithubId] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const enrichedData = dataJson.map((item) => ({
      ...item,
      onlineStatus: false, // Default online status is "Offline"
    }));
    setData(enrichedData);
  }, []);

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("userData");
    window.location.href = "http://localhost:3000/";
  };

  const handleEdit = (rowData) => {
    const updatedData = data.map((item) =>
      item.id === rowData.id ? { ...item, ...rowData } : item
    );
    setData(updatedData);
  };

  const handleDelete = (rowId) => {
    const updatedData = data.filter((item) => item.id !== rowId);
    setData(updatedData);
  };

  const handleCopy = (rowData) => {
    const newRow = {
      ...rowData,
      id: Math.max(...data.map((d) => d.id)) + 1,
    };
    setData((prevData) => [...prevData, newRow]);
  };

  const handleStatusToggle = (rowId) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === rowId ? { ...item, status: !item.status } : item
      )
    );
  };

  const handleOnlineStatusToggle = (rowId) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === rowId ? { ...item, onlineStatus: !item.onlineStatus } : item
      )
    );
  };

  const handleSearch = () => {
    const filteredData = dataJson.filter(
      (item) =>
        item.id.toString().includes(searchId) &&
        item.name.toLowerCase().includes(searchName.toLowerCase()) &&
        item.githubId.toLowerCase().includes(searchGithubId.toLowerCase())
    );
    setData(filteredData);
  };

  useEffect(() => {
    handleSearch();
  }, [searchId, searchName, searchGithubId]);
  const handleSaving = useCallback(
    (e) => {
      const changes = e.changes || [];
      if (!Array.isArray(changes)) {
        console.error("Invalid changes received:", changes);
        return;
      }

      changes.forEach((change) => {
        if (change.type === "insert") {
          // Check if ID is unique when inserting a new row
          const existingId = data.find((item) => item.id === change.data.id);
          if (existingId) {
            e.cancel = true; // Prevent default behavior
            alert("ID must be unique!");
            return;
          }
          const newRow = {
            id: Math.max(...data.map((d) => d.id)) + 1,
            ...change.data,
          };
          setData((prevData) => [...prevData, newRow]);
        } else if (change.type === "update") {
          // Check if the updated ID is unique
          const existingId = data.find(
            (item) => item.id === change.data.id && item.id !== change.key
          );
          if (existingId) {
            e.cancel = true; // Prevent default behavior
            alert("ID must be unique!");
            return;
          }
          setData((prevData) =>
            prevData.map((item) =>
              item.id === change.key ? { ...item, ...change.data } : item
            )
          );
        } else if (change.type === "remove") {
          setData((prevData) =>
            prevData.filter((item) => item.id !== change.key)
          );
        }
      });

      e.cancel = true; // Prevents the default DevExtreme saving behavior
    },
    [data]
  );

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z ]*$/, "Name must only contain letters and spaces"),
    githubId: Yup.string().required("GitHub ID is required"),
  });

  // Create MUI theme for dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="dashboard">
        <h1>Dashboard</h1>

        {/* Toggle Dark Mode */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDarkMode((prevMode) => !prevMode)}
        >
          Dark Mode
        </Button>

        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        {/* Search Fields */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by ID"
            className="search-bar"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Name"
            className="search-bar"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by GitHub ID"
            className="search-bar"
            value={searchGithubId}
            onChange={(e) => setSearchGithubId(e.target.value)}
          />
        </div>

        <div className="data-grid-container">
          <DataGrid
            dataSource={data}
            keyExpr="id"
            showBorders={true}
            columnAutoWidth={true}
            onSaving={handleSaving}
            editing={{
              mode: "popup",
              allowAdding: false,
              allowUpdating: true,
              allowDeleting: true,
              useIcons: true,
            }}
          >
            {/* Columns go here */}
          </DataGrid>
        </div>

        {/* Formik Example */}
        <Formik
          initialValues={{ name: "", githubId: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            const newRow = {
              id: Math.max(...data.map((d) => d.id)) + 1,
              ...values,
            };
            setData((prevData) => [...prevData, newRow]);
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form className="formik-form">
              <div>
                <Field name="name" placeholder="Name" />
                {errors.name && touched.name && (
                  <div className="error">{errors.name}</div>
                )}
              </div>

              <div>
                <Field name="githubId" placeholder="GitHub ID" />
                {errors.githubId && touched.githubId && (
                  <div className="error">{errors.githubId}</div>
                )}
              </div>

              <button type="submit">Add</button>
            </Form>
          )}
        </Formik>
      </div>
    </ThemeProvider>
  );
};

export default Dashboard;
