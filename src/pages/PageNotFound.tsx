import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
// import { useTheme } from "../context/ThemeContext";
// import { homeStyles } from "./HomeStyles";
import { ArrowForward } from "@mui/icons-material";
import errorImg from "../assets/error.jpg";

const PageNotFound: React.FC = () => {
  //   const { mode } = useTheme();
  //   const styles = homeStyles(mode);

  return (
    <Box display="flex" height="100%">
      <Container
        className="container"
        maxWidth="sm"
        style={{ textAlign: "center", padding: "2rem" }}
      >
        <div className="gif">
          <img src={errorImg} alt="gif_ing" style={{ height: "300px" }} />
        </div>
        <div className="content">
          <Typography variant="h4" className="main-heading" gutterBottom>
            This page is gone.
          </Typography>
          <Typography variant="body1" paragraph>
            ...maybe the page you're looking for is not found or never existed.
          </Typography>
          <a
            href="/chatbot"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="contained"
              color="primary"
              className="pagenot-found-btn"
              endIcon={<ArrowForward />}
            >
              Back to home
            </Button>
          </a>
        </div>
      </Container>
    </Box>
  );
};

export default PageNotFound;
