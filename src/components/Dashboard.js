import React, { useState, useEffect } from "react";
import DataGrid, {
  Column,
  Editing,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css"; // DevExtreme CSS
import dataJson from "../data/data.json";
import { deleteCookie } from "../utils/cookieUtils";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setData(dataJson); // Load initial data from data.json
  }, []);

  const handleLogout = () => {
    deleteCookie("accessToken");
    deleteCookie("userData");
    navigate("/");
  };

  const handleAdd = (e) => {
    const newEntry = e.data; // Get new row data
    setData([...data, { id: data.length + 1, ...newEntry }]); // Add with unique ID
  };

  const handleEdit = (e) => {
    const updatedData = data.map((item) =>
      item.id === e.key ? { ...item, ...e.data } : item
    );
    setData(updatedData); // Update edited row
  };

  const handleDelete = (e) => {
    const updatedData = data.filter((item) => item.id !== e.key);
    setData(updatedData); // Remove deleted row
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <DataGrid
        dataSource={data}
        keyExpr="id"
        showBorders={true}
        columnAutoWidth={true}
        allowColumnResizing={true}
        editing={{
          mode: "popup", // Use popup for add/edit
          allowAdding: true,
          allowUpdating: true,
          allowDeleting: true,
          popup: {
            title: "Add/Edit Data",
            showTitle: true,
            width: 400, // Smaller popup width
            height: 250, // Smaller popup height
          },
          form: {
            colCount: 1, // Reduce form layout to a single column
            items: [
              {
                dataField: "name", // Ensure 'name' field is editable
                label: { text: "Name" },
              },
              {
                dataField: "githubId", // Add 'GitHub ID' explicitly
                label: { text: "GitHub ID" },
              },
            ],
          },
        }}
        onRowInserting={handleAdd}
        onRowUpdating={handleEdit}
        onRowRemoving={handleDelete}
      >
        {/* Columns with Sorting Enabled */}
        <Column
          dataField="id"
          caption="ID"
          width={50}
          allowEditing={false}
          allowSorting={true}
        />
        <Column dataField="name" caption="Name" allowSorting={true} />
        <Column dataField="githubId" caption="GitHub ID" allowSorting={true} />

        {/* Add Toolbar for Custom "Create" Button */}
        <Toolbar>
          <Item location="before">
            <button
              className="add-button"
              onClick={() =>
                document.querySelector(".dx-datagrid-addrow-button").click()
              }
            >
              ➕ Add New Entry
            </button>
          </Item>
        </Toolbar>
      </DataGrid>

      {/* Add CSS for Stylish Button */}
      <style jsx>{`
        .add-button {
          background-color: #4caf50;
          color: white;
          font-size: 14px;
          font-weight: bold;
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .add-button:hover {
          background-color: #45a049;
        }
        .dashboard {
          padding: 20px;
          max-width: 800px;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
