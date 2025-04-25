// Updated CustomerDashboard with 3-step ordering

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  AppBar,
  Toolbar,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Menu
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';

const extrasList = ["Table Setup", "Serving Staff", "Disposable Plates", "Glasses", "Water Cans",
  "Water Bottles"];

const CustomerDashboard = () => {
  const [caterings, setCaterings] = useState([]);
  const [selectedCatering, setSelectedCatering] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [numPeople, setNumPeople] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventName, setEventName] = useState("");
  const [extras, setExtras] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Online Payment");

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Menu & Details", "Extras & Instructions", "Payment"];

  useEffect(() => {
    fetchCaterings();
  }, []);

  const fetchCaterings = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/caterings/getAllCaterings");
      setCaterings(response.data);
    } catch (error) {
      console.error("Error fetching caterings:", error);
    }
  };

  const fetchMenuItems = async (catering) => {
    try {
      setSelectedCatering(catering);
      const response = await axios.get(`http://localhost:8080/api/caterings/${catering.cateringid}/menu`);
      setMenuItems(response.data);
      setNumPeople("");
      setName("");
      setAddress("");
      setEmail("");
      setPhone("");
      setTotalPrice(0);
      setSelectedMenuItems([]);
      setSelectAll(false);
      setDate("");
      setTime("");
      setExtras([]);
      setInstructions("");
      setPaymentMethod("Online Payment");
      setActiveStep(0);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    if (selectedCatering && numPeople) {
      setTotalPrice(selectedCatering.pricePerPerson * parseInt(numPeople));
    }
  }, [numPeople, selectedCatering]);

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleOrderSubmit();
    }
  };

  // const handleOrderSubmit = () => {
    
  //   if (!numPeople || !name || !eventName || !address || !email || !phone || !date || !time || selectedMenuItems.length === 0) {
  //     alert("Please fill all required fields and select menu items.");
  //     return;
  //   }

  //   alert(`\n✅ Order Summary:\n\nEvent: ${eventName}\nCatering: ${selectedCatering.cateringName}\nDate: ${date} | Time: ${time}\nName: ${name}\nPhone: ${phone}\nExtras: ${extras.join(", ")}\nInstructions: ${instructions}\nPayment: ${paymentMethod}\n\nTotal Price: ₹${totalPrice}\nMenu: ${selectedMenuItems.map((i) => i.menuName).join(", ")}`);
  //   setModalOpen(false);
  // };

  const handleOrderSubmit = async () => {
    if (
      !numPeople || !name || !eventName || !address || !email ||
      !phone || !date || !time || selectedMenuItems.length === 0
    ) {
      toast.error("Please fill all required fields and select menu items.");
      return;
    }
    const token = localStorage.getItem("token"); // Or however you're storing the token


    const directImageUrls = [
      "https://example.com/image1.jpg",
      "https://example.com/image2.png",
      "https://example.com/image3.jpg",
    ];

    
    // Prepare the order data
    const orderData = {
      numberofpeople: numPeople, // ✅ it's a string
      name,
      address,
      email,
      phone,
      eventName,
      date,
      time,
      selectedMenuItems,
      extras,
      instructions,
      paymentMethod,
      totalPrice,
    };
  
    try {
      // Send a POST request to save the order
      const response = await axios.post("http://localhost:8080/api/orders/customer/place", orderData,
        
        

      );
      console.log("Response:", response);
      // Handle the success response
      if (response.status === 200) {
        toast.success(
          `✅ Order Placed!\n\nEvent: ${eventName}\nCatering: ${selectedCatering.cateringName}\nDate: ${date} | Time: ${time}\nName: ${name}\nPhone: ${phone}\nExtras: ${extras.join(", ")}\nInstructions: ${instructions}\nPayment: ${paymentMethod}\nTotal Price: ₹${totalPrice}\nMenu: ${selectedMenuItems.map((i) => i.menuName).join(", ")}`,
          {
            autoClose: 7000, // optional timeout
            style: { whiteSpace: 'pre-line' } // to preserve line breaks
          }
        );
        setModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to place the order. Please try again.");
      console.error("Error saving order:", error);
    }
    

  };
  



  const handleSelectItem = (item) => {
    const isSelected = selectedMenuItems.find((i) => i.menuId === item.menuId);
    if (isSelected) {
      setSelectedMenuItems(selectedMenuItems.filter((i) => i.menuId !== item.menuId));
    } else {
      setSelectedMenuItems([...selectedMenuItems, item]);
    }
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedMenuItems(menuItems);
    } else {
      setSelectedMenuItems([]);
    }
  };

  const handleExtrasChange = (option) => {
    if (extras.includes(option)) {
      setExtras(extras.filter((e) => e !== option));
    } else {
      setExtras([...extras, option]);
    }
  };

  const handleBackStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };


  const handleOrderHistory = () => {
    navigate("/order-history"); // Adjust the route according to your application
    handleMenuClose();
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout functionality here (e.g., clearing tokens)
    navigate("/");
  };
  return (
   
    <Container>
        <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          MealNest
        </Typography>
        <IconButton color="inherit" onClick={handleMenuClick}>
          <div fontSize="large" /> <AccountCircle />{/* Add your icon here */}
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          
          <MenuItem onClick={handleOrderHistory}>View Order History</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
      <Typography variant="h4" sx={{ mt: 3, mb: 10, textAlign: "center" }}>
        Our Services
      </Typography>
      <Grid container spacing={3}>
        {caterings.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", width: "100%" }}>
            No caterings found
          </Typography>
        ) : (
          caterings.map((catering) => (
            <Grid item xs={12} sm={6} md={4} key={catering.cateringId}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={catering.cateringImage}
                  alt={catering.cateringName}
                />
                <CardContent>
                  <Typography variant="h6">{catering.cateringName}</Typography>
                  <Typography variant="body2">{catering.address}</Typography>
                  <Typography variant="body2">
                    ⭐ {catering.reviews?.length > 0 ? catering.reviews[0].rating : "No Rating"}
                  </Typography>
                  <Typography variant="body2">
                    💰 Price per person: ₹{catering.pricePerPerson}
                  </Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => fetchMenuItems(catering)}>
                    View More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxWidth: 1000,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
           
          }}
        >
          <IconButton onClick={() => setModalOpen(false)} sx={{ position: "absolute", top: 8, right: 8 }}>
            <CloseIcon />
          </IconButton>

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {selectedCatering?.cateringName} - Menu
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} />}
                  label="Select All"
                />
               <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
  {menuItems.map((item, index) => (
    <ListItem key={index} sx={{ alignItems: "center" }}>
      <Checkbox
        checked={!!selectedMenuItems.find((i) => i.menuId === item.menuId)}
        onChange={() => handleSelectItem(item)}
      />
      <img src={item.imageUrl} alt={item.name} width={50} height={50} style={{ marginRight: 10 }} />
      <ListItemText primary={item.menuName} secondary={`Price: ₹${item.price}`} />
    </ListItem>
  ))}
</List>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Number of People" fullWidth  type="number" value={numPeople} onChange={(e) => setNumPeople(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Address" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Phone" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} sx={{ mb: 2 }} />
                <TextField label="Date" type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
                <TextField label="Time" type="time" fullWidth value={time} onChange={(e) => setTime(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
                <Typography sx={{ mb: 2 }}>Total Price: ₹{isNaN(totalPrice) ? 0 : totalPrice}</Typography>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                 <TextField
                  label="Event Name"
                  fullWidth
                  placeholder="e.g., Wedding Reception, Birthday Party"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6">Extras</Typography>
               

                {extrasList.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={<Checkbox checked={extras.includes(option)} onChange={() => handleExtrasChange(option)} />}
                    label={option}
                  />
                ))}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Special Instructions"
                  multiline
                  rows={4}
                  fullWidth
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </Grid>
            </Grid>
          )}

{activeStep === 2 && (
  <FormControl component="fieldset">
    <FormLabel component="legend">Payment Method</FormLabel>
    <RadioGroup
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
    >
      <FormControlLabel
        value="Online Payment"
        control={<Radio />}
        label="Online Payment"
      />
      <Box ml={2} display="flex" alignItems="center">
              <img
                src="data:image/png;base64,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"
                alt="Paytm"
                style={{ width: '60px', height: 'auto', marginRight: 8 }}
                
              />
              <img
                src="data:image/png;base64,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"
                alt="PhonePe"
                width={40}
                style={{ width: '50px', height: 'auto', marginRight: 8 }}
              />
              <a href="https://payments.google.com/gp/w/home/signup?sctid=1995974141456534" target="_blank">
              <img
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxEQDxAQEhEQEBAVGBIRFg8QFxUXGhgQFRUXFhUWExUYHSggGxolHhcVIT0iJSkrLi4uFyAzODMsNzQtLisBCgoKDg0OGhAQGi0lICYtLSstLS0tLS0vMC0tLS0tMCsrLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBBAcDAv/EAEAQAAIBAwEFBQUFBQYHAAAAAAABAgMEERIFBiExQRNRYXGBByIyQpEUUnKhsSNTYsHRMzaCg7KzFjRjc5Ki8P/EABsBAQACAwEBAAAAAAAAAAAAAAABBQIDBAYH/8QAMhEBAAIBAwIEAwcDBQAAAAAAAAECAwQRIRIxBRNBcSJRYQYygaGxweEjkdEVQlJy8P/aAAwDAQACEQMRAD8A7eSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGveX1KjHVVqQpx75tL6Z5kTMR3YXyVpG9p2QtXfaxi8dq5eMYVGvrg1+dT5uS3iWnj/d+rasd57Os0oV4anyjPMG/JTSMoyVntLZj1mHJxWyYRm6gAAAAAAAAAAAAAAAAAAAAAAAAAAAFV3w3sVr+xpYlcNZbfFQT5N98vD1fjpyZYrwrddrow/BTm36OZXd1Uqzc6k5VJv5pPP07l4I5JtM8y8/kyWyW3tO8vIhgwwJzYe9Nza4ipdpS/dVMtJfwy5x/TwNtctquzT67Jh433j5OibC3rt7vEVLs6v7qpwb/C+Uv18Dprkiy90+uxZuInafknTY7AAAAAAAAAAAAAAAAAAAAAAABr3V9SpY7SrTp55dpKMf1ZMVtPaGM2iO8tTa+2adC2ncKUZxS93S01Kb4RSa8TC89EctWfPXFjm7jVxXlUnKpN6pyblKT6tnBM7zu8ne83tNp7y8yGIAAw2RO0ctuDBkz5Ix4o3mfSHw6hpnN8nttF9i72rFtTk6fpXmf7rVsHfuvQShVTuKa5NvE0vxfN6/U3U1lo+9C8j7N1x12plmfeI/Z0TYm3KF5DVSnlr4qb4Sj+Jfz5Hdjy1yRvVT6rR5dNbpyR7T6Skja5QAAAAAAAAAAAAAAAAAAAIbevbKs7dzWO1l7lOL+8+rXclx+iNuDF5l9mrLk6auQ160qknOcnOb4uUnltl1WsVjaIV0zM8y+NTxpy9LedPTK4Zx3mvLhx5Y2tDC9IvG0vnBSajw6+PmnMK7LpZrzXmArXIAAmI9HlOWfI5cl+qeH1n7OeDV0OCMl4/qWjn6R6R/l8Gt6UCW3sraFS2rQrU3iUXy6Sj1jLwZljvNJ3hz6nT0z45x2/99XcdnXca9GnWh8M4xmvVZw/FF3S3VWLQ8BlxTivNJ7xw2DNrAAAAAAAAAAAAAAAAAA2ByDe7bP2u5cov9lDMKa/hzxl6v8ALBcabD5dOe8q7Lfrt9EGdDUAAMM81r8daZp6e08qjU0iuSdg4nOmN3LDtJ9pJe5Dl4z6fTn9Cq8U1Xl08uvef0eg8B8P87L5t44r+c/wmNpbGpVsvGif349/8S6lLg1l8XHePk+g4dVfHx6KjtGwnQnon5qS5Nd6LvDnrlrvVcYc1ctd4apubgDsHs8bezaGe+ql5drMt9JP9KHiPGIiNZfb6fpCyHSrAAAAAAAAAAAAAAAAAAqXtB212NDsIP8AaVU08dKXKT9eX1OrSYeu3VPaHPqL7R0x3cxLZwsgYAETMV5lEztG7B5XU5vNyTdTZsnXeZfdCk5yjCPGUnhHLkyVx1m1u0GHFbNkjHTvK82dsqVONOPJLn3vq2eN1Ga2bJN7er6VpNNTT4q46+n5vU1OlB73RXYwb5qaS9U8/oWXhsz5kx6bO/w+Z8yfZUi6XD1tbeVWcKcFmc2oxXiya1m07Qwy5K4qTe3aHdNkWKt6FKhHioRUc976v1eX6l5jp01iHz3PmnNltkn1ltmbUAAAAAAAAAAAAAAAAMN44gmeHFNubRdzcVKzfCT91d1NcIr6fqy7w06KRCsyW6rTLQNrBkDABlT4nqNo8qPxcOry7fDDBR7q5Y92LHCdaS4v3Y+XV/yKHxbU7zGGs+71/wBntDtE6i0fSPb5p4o3qWQKZvJf9rV0J+5DK85fM/5ehfaHB5dN57yutFh6KdU95RB3O1fvZjsXMpXk1wWadLP3uU5L/T6s79Hi3nrl5vx3V8RgrP1n9o/d0YsXmQAAAAAAAAAAAAAAAAA1dq5+z18c+zqY89LwTT70Mb/dlw5F+qwDIGDXlyxjpN5YXvFKzaWDymS85LTafVS2t1TvLa2bZOtUUFy5yfdH+px6vUxgxzb19HZ4foravNFI7es/RdoQUUopYSSSXgjx9rTa02nu+kY6RjrFKxxHEMkMkZt/aHY0nh+/P3Y+He/T9cHXosHmX57Q6tJh82/PaFJPQr1tbNsZ3FanRh8U2op9y6yfgll+hlSk3tFYadRnrhx2yW9Hctn2UKFKnRgsQhFRXp1fi+Zd0rFaxEPn+bLbLeb27zy2DNrAAAAAAAAAAAAAAAAADEo5WHyfAglxLbOz3bXFWi/lbx4wfGL+mC9w366RMKu9em0w0jYxAJ3ZOxY1KWuepOXw6eGIrr6nh/H/ABq1NR5GLtXv7rXT+E49Tg6sszz22fb3Y4/2vD8HH/UVH+s8fc/P+HPP2Y2txk4/6/ymbGyhRjpgvOT5t+JVajU3z36rvQ6LQ4tJToxx+L3Od1kpJJt8EuLb7iYiZnaExG/ZQ9r33b1ZT+Ve7Ffwr+vM9HpsPlUiv91/psPlU2aR0N7pHsx2LphK7mvenmFPPSmn70vVrHlHxLHR4to65/D2eV8d1nXaMFe0cz7/AML4d7z4AAAAAAAAAAAAAAAAAAAFe3u3aV5BSg1GvBYjJ8pR56ZeHj0yb9PnnFPPZpy4uuOHLL2zqUZunVhKnNfLL9U+q8UW9L1vG9XBNZrO0vBmSF9topQglyUYr0SPjWqvN817T6zL2uKIilYjts9DQ2AGANy22IrulVjKUoQa06oYznn16f1LzwfQRmtOS3aOI93Pl1k6e9ZrETKpbU3FvKUnoiriHSVNpP8AxRk+D8slzfSZK9uVxp/GtNkj456Z+v7S9di7h3NWadddhS65ac2u6KWcebMsWkvafi4hr1XjeGldsXxT+Ue7qdvRjThGEEowilFRXSKWEi0iIiNoeStabWm0zzL0JYgAAAAAAAAAAAAAAAAAAAANTaWzaNxDRVpxnHpnmn3xfNPyMqXtSd6yxtSLRy5/t7cWrSzO3brU/wB2/jS8OkvTj4MscOsrbi/DjyaeY5q+9kXGulFPhOHuST5qS4cUfN/HNHOm1dv+Np3iff8Aw9JoM8ZcMfOOJbxUO0A+7ei5yUIrLf8A9lm3BhtmyRjrHdhe8Ur1T6LlbUFThGC5Lh69WfQNPgrhxxjr6KG95vabS9TexMAAAAAAAAAAAAAAAAAAAAAAAAAABoX2yKVV63HTUxjtI8G13S715nNq9LTU4+i/4fRniyTjt1VRFbYVVfDpmvPH5M8vl8C1FZ+CYmP7LOuvxz97hilsOq3x0wXe3n8kY4vAtTafi2j8y2uxx25Tez9nworhxk+cnz8l3I9JovD8Wlr8Pf1lX5s9ss8tw72kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPK6uYUoSqVJKEIpylKXJJAc+2j7TW56LW31rpOq3mXiqceOPXPgidkbsbP8Aac1NQurbQusqbeY+Lpy4tev1Gxu6Hb1o1IRnF5jJKUX3xaynxIS9AAAAAAAAKpX3ulHai2f2MXFyjHtdbz71PX8OPTmNkLWEgACA3x3ilYUqdSNJVXOfZ6XJx+WUs5w+4RAhp7438E5T2TWUFxbUp8uvyDZCybu7eo31HtaWVh6ZQljVGXPDx+oEoEgAAAAAAAAAAA5x7XtoySt7aLxGWqrNLrhqME/DOp+aRMIlcN2dg0rKhGEYx7RpdpVwsyn1y+7OcLoQlo7Q2vsm40dtWtKuhqUXNp4a/l4cmNpQlrTbVtVhUnTr0pwprVOUZJqMcN5l3cE/oEqNde0K5rVZQsbXtIrrKE5ycfvOMGtK+pOyEjutv27isra5pKjWb0xkspOa+SUZcYyEwbtzfHfOFi1ShDtbiS1aW8RjF8nLHFt9y/LhmE7q7H2gX9GUZXNolSly9ypTbX8MpNpsnZG67veK3+xfbtX7DTq5cc506Mfe1e7jvISpNPf3aFeUp29nGdGL4pQqTaX8U4vCePAlDf2Jv/O6vaNuqEYU6nBuTepSVNyku58VjyI2EZff3mh+Ol/sIn0Fj3t3yVpUjbUafb3Lx7vHEdXwppcZSfcu8gQ//HF/azg76zUKUn8UIyi/HDcmm/DgSbug21eNSEKkGpQklKMl1i1lMhKle1n/AJa1/wC/H/RMQhaKu37SMXJ3Vukv+pB/RJ5YSpe49dqrtW9pUqkrdybp0qa4zalKWIx78NcOmomUNuht3bNaHb0rKjGjzjCo3rlHwzJP8kQN+w3snc2NxXpUkrmh/aW889OLw1h8lL1i0BLbsbYV7a066SjJ5Uor5akXhry6+TQS0LLeKpX2lWtKcIOhRX7Ss8514xpXT4nj/DICyAAAAAAAAc69ruzJSjQuopuMNVKbXRSacH5Z1L1RMIlad1t46N7Ri1OKrJJVKTeJKWOLS6xfeQlUt6N2tl2VCcm6nbNNU6XaPMp44cPurqyYlCM3csKi2LtKsk12ijFeNOk/2jXhhyXoxPcWL2S1aX2SrCLj23aNzXVxcY6H+HmvPIkQW/c4T2xbqhh1V2EZOH77tHhPHzJafyEdhm8lCG8eq4wodpFpz5LNJKk+PRS0/QeguXtBq0ls6uqjj7ySpp83VynHT4rn5JkQOfKjVewHLjoV1q/y9Cjny1/mT6i++z69oPZ1GMJQTppqpHKTVTLcnLz557mRIp1lcUqu8cZ0cOm6ksSjyclRkpSXg5ZeevMn0Gzff3mh+Ol/sIj0EVdUK0tt14xrRt67q1NFWfJJp6EuDxmDSXmifQTO8GwL7slG82nQVJyikquUtfTjp/MiBd91rGVvZ0KMpwquKaVSHwuLk3HS+7DQTCte1pZtrZdHXS/9JiEJOHs/2ann7O351av5rUEtreS+js6wnUo04R0aYU6aWIqUpJJtLost+IQg9lbD2hcUoXFTadanOpFVFCmk4pSWY5SaT59EBr+zXLvNqaqka0tVNSqxSSnLXVTkkuHHn6kyQ17LaC2Pc7Qt5cKUoO5t0+Tl8sF5/D/lkCf9nOy3Rs+2nxrXD7eUnz0v4M+jcv8AExKVqAAAAAAAA87ijGpCUJxU4STjKMllNPmmgKFtT2YU5Tcreu6S59nUjrS/DJNPHnnzJ3Q+dm+y+CmpXFw6kebhTjoz4Sm23jyw/Ebi+0bWEKapRhGNNLQoJcFHGMY7iEqJtL2ZxdRztrh0U8/s5JvTnpGSaePB/UndGyT3V3EpWVRVpzdess6Xp0xjnm4xy25eLZG5s3N690aN+oycnSrRWlVYpPMeemceq9UxCVatvZhJzj2125U1w0wi09PcnJtR+jJ3RsuO0IWlpZOnVUYWkYqm4tNrS+GOGW22+fPLISoGz9zbC8TrUL2UKKbzTqxhrik+rbWF1TafAlDw3ZtaL25BWuZW9LU1POcxjScJTb8ZP80JkXSvuhq2mtodvjDjLsdH3YaMa9XryIS+t7NzaN+1U1OjXS09ollSj0U48M478pjcQNt7M5SnF3F3KrCPyRTy13KUpPSvJE7o2dAtreFKEacIqEIpRjGPJRXJIhKH3s3e+306VPtey0VFVzp1ZxFrGMrHMCcA1NrbOp3VCpQqpuE1h44NNPKafemk/QCpUNy7yEPs62lVVpy7OMcS0fdUs8P08AjZL7sbqwsKtxOFRyhV0KNNxxojBywtWXq+Lw5BKB32tYXu07KzisyipTrTXSi2paX6Rf8A5rvCF+jFJJJYS4JLuCWQAAAAAAAAAAAAAAAADyu7aFWnKnUipwksSjLk0BRrr2W28p5hXqwj9yUYzx4KXD88k7o2WXdzdq3sItUk3OWNVWeHKWOS4cEvBEJTIAAAAAAAAABD7L3ep0Lm4utdSpWrc3U0+7HOdMMJcOEVxz8KAmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k="
                alt="Google Pay"
                style={{ width: '60px', height: 'auto', marginRight: 8 }}
           
              />
              </a>
            </Box>
      <FormControlLabel
        value="Pay on Delivery"
        control={<Radio />}
        label={
          <Box display="flex" alignItems="center">
            Pay on Delivery
            
          </Box>
        }
      />
    </RadioGroup>
  </FormControl>
)}

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          {activeStep !== 0 && (
    <Button variant="outlined" onClick={handleBackStep}>
      Back
    </Button>
  )}
            
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" onClick={handleNextStep}>
              {activeStep === steps.length - 1 ? "Place Order" : "Continue"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <ToastContainer
  
/>
    </Container>
  );
};

export default CustomerDashboard;
