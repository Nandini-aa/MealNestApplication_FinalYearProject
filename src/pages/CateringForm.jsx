import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, Grid, TextField, Button, Paper, Typography, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

// Styling for the component
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  maxWidth: "600px",
  margin: "auto",
  padding: "20px",
};

const sectionStyle = {
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  backgroundColor: "#f5f5f5",
  boxShadow: "0 2px 5px rgba(12, 75, 235, 0.12)",
};

const buttonStyle = {
  backgroundColor: "SlateBlue",
  color: "white",
  padding: "15px",
  cursor: "pointer",
  border: "none",
  borderRadius: "8px",
  width: "100%",
};

const iconStyle = {
  cursor: "pointer",
};

const CateringForm = ({ cateringId }) => {
  const [cateringData, setCateringData] = useState({
    cateringName: "",
    description: "",
    address: "",
    phoneNumber: "",
    chef: {
      chefName: "",
      chefPhoneNumber: "",
      chefexperience: "",
      chefspecialization: "",
    },
    menu: [{ menuName: "", price: 0 }],
  });

  useEffect(() => {
    if (cateringId) {
      axios
        .get(`/api/caterings/${cateringId}`)
        .then((response) => setCateringData(response.data))
        .catch((error) => console.error("Error fetching catering:", error));
    }
  }, [cateringId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCateringData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChefChange = (e) => {
    const { name, value } = e.target;
    setCateringData((prevState) => ({
      ...prevState,
      chef: {
        ...prevState.chef,
        [name]: value,
      },
    }));
  };

  const handleMenuChange = (index, e) => {
    const { name, value } = e.target;
    const newMenu = [...cateringData.menu];
    newMenu[index] = {
      ...newMenu[index],
      [name]: value,
    };
    setCateringData((prevState) => ({
      ...prevState,
      menu: newMenu,
    }));
  };

  const handleAddMenuItem = () => {
    setCateringData((prevState) => ({
      ...prevState,
      menu: [...prevState.menu, { menuName: "", price: 0 }],
    }));
  };

  const handleRemoveMenuItem = (index) => {
    const newMenu = [...cateringData.menu];
    newMenu.splice(index, 1);
    setCateringData((prevState) => ({
      ...prevState,
      menu: newMenu,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cateringId) {
      axios
        .put(`/api/caterings/${cateringId}`, cateringData)
        .then((response) => console.log("Catering updated", response))
        .catch((error) => console.error("Error updating catering:", error));
    } else {
      axios
        .post("/api/caterings", cateringData)
        .then((response) => console.log("Catering created", response))
        .catch((error) => console.error("Error creating catering:", error));
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", maxWidth: "800px", margin: "auto", borderRadius: "15px" }}>
      <Typography variant="h4" align="center" gutterBottom style={{ color: "SlateBlue" }}>
        {cateringId ? "Update Catering" : "Add New Catering"}
      </Typography>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Catering Info Section */}
        <Card style={sectionStyle}>
          <Typography variant="h6" gutterBottom>
            Catering Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Catering Name"
                variant="outlined"
                fullWidth
                name="cateringName"
                value={cateringData.cateringName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                multiline
                rows={4}
                value={cateringData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                value={cateringData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                name="phoneNumber"
                value={cateringData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Chef Info Section */}
        <Card style={sectionStyle}>
          <Typography variant="h6" gutterBottom>
            Chef Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chef Name"
                variant="outlined"
                fullWidth
                name="chefName"
                value={cateringData.chef.chefName}
                onChange={handleChefChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chef Phone Number"
                variant="outlined"
                fullWidth
                name="chefPhoneNumber"
                value={cateringData.chef.chefPhoneNumber}
                onChange={handleChefChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chef Experience"
                variant="outlined"
                fullWidth
                name="chefexperience"
                value={cateringData.chef.chefexperience}
                onChange={handleChefChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Chef Specialization"
                variant="outlined"
                fullWidth
                name="chefspecialization"
                value={cateringData.chef.chefspecialization}
                onChange={handleChefChange}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Menu Section */}
        <Card style={sectionStyle}>
          <Typography variant="h6" gutterBottom>
            Menu Items
            <IconButton onClick={handleAddMenuItem} style={iconStyle}>
              <Add />
            </IconButton>
          </Typography>
          {cateringData.menu.map((menuItem, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Menu Item Name"
                  variant="outlined"
                  fullWidth
                  name="menuName"
                  value={menuItem.menuName}
                  onChange={(e) => handleMenuChange(index, e)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="price"
                  value={menuItem.price}
                  onChange={(e) => handleMenuChange(index, e)}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton onClick={() => handleRemoveMenuItem(index)} style={iconStyle}>
                  <Remove />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Card>

        <Button type="submit" variant="contained" style={buttonStyle}>
          {cateringId ? "Update Catering" : "Add Catering"}
        </Button>
      </form>
    </Paper>
  );
};

export default CateringForm;
