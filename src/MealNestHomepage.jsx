import React, { useState } from "react";
import { 
  Typography,
  TextField,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate} from 'react-router-dom';

const MealNestHomepage = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  const handleOrderClick = () => {
    setOpenLogin(true);
  };

  const handleClose = () => {
    setOpenLogin(false);
  };

  const handleLoginRedirect = () => {
    navigate("/customer-login");
  };

  const banners = [
    "https://img.freepik.com/free-photo/delicious-indian-food-assortment_23-2148747711.jpg",
    "https://vismaifood.com/storage/app/uploads/public/980/eb9/ed6/thumb__700_0_0_0_auto.jpg",
    "https://i.pinimg.com/236x/f7/90/cb/f790cbc713bbc29a10ff9944b824d6e6.jpg",
  ];

  const meals = [
    {
      id: 1,
      name: "Andhra Veg Meals",
      chef: "Chef Reddy",
      image: "https://img.freepik.com/free-photo/delicious-food-table_23-2150857814.jpg",
    },
    {
      id: 2,
      name: "Chicken Curry & Rice",
      chef: "Chef Priya",
      image: "https://plus.unsplash.com/premium_photo-1695456065048-52a053ce9dd2?fm=jpg&q=60&w=3000",
    },
    {
      id: 3,
      name: "Pesarattu & Chutney",
      chef: "Chef Kiran",
      image: "https://images.slurrp.com/webstories/wp-content/uploads/2023/10/03192550/Pesarattu_VC-1.jpg",
    },
    {
      id: 4,
      name: "Ragi Sangati & Natukodi Pulusu",
      chef: "Chef Suresh",
      image: "https://i.ytimg.com/vi/nZ9zLi-44W8/maxresdefault.jpg",
    },
    {
      id: 5,
      name: "Grilled Chicken",
      chef: "Chef Ramesh",
      image: "https://images.unsplash.com/photo-1592011432621-f7f576f44484?fm=jpg&q=60&w=3000",
    },
    {
      id: 6,
      name: "Masala Vankaya Curry & Rice",
      chef: "Chef Meera",
      image: "https://www.shutterstock.com/image-photo/egg-plant-curry-brinjal-masala-600nw-2189644785.jpg",
    },
  ];

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MealNest
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search meals..."
            sx={{ background: "white", borderRadius: 1, mr: 2 }}
          />
          <SearchIcon sx={{ color: "white" }} />
        </Toolbar>
      </AppBar>

      {/* Smaller Banners */}
      <Container sx={{ mt: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          {banners.map((banner, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card sx={{ maxWidth: 200 }}>
                <CardMedia component="img" height="120" image={banner} alt={`Banner ${index + 1}`} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Available Meals Section */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Meals
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {meals.map((meal) => (
            <Grid item xs={12} sm={4} md={3} key={meal.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={meal.image}
                  alt={meal.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {meal.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    By {meal.chef}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 1 }} fullWidth onClick={handleOrderClick}>
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={handleClose}>
        <DialogTitle>Login as Customer</DialogTitle>
        <DialogContent>
          <Typography>Please log in to place an order.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleLoginRedirect} color="secondary" variant="contained">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MealNestHomepage;
