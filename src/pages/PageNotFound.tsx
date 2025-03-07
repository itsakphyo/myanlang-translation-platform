import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
    >
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={2}>
        The page you are looking for might have been removed or does not exist.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate("/")}> 
        Go Home
      </Button>
    </Box>
  );
};

export default PageNotFound;