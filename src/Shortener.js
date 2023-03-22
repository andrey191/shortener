import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  Alert,
  CircularProgress,
  Paper,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import validator from "validator";
import genShortUrl from "./api";

function Shortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openInNewTab = (e) => {
    const newWindow = window.open(e.shortUrl, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };



  const genResult = async (event) => {
    event.preventDefault();
    if (shortUrl) {
      setShortUrl("");
      setLongUrl("");
    } else {
      if (
        validator.isURL(longUrl)
      ) {
        setError("");
        setIsLoading(true);
        await genShortUrl(longUrl)
          .then((response) => {
            setTimeout(() => {
              setIsLoading(false);
              setShortUrl(response.data.url);
            }, 500);
          })
          .catch((error) => {
            setIsLoading(false);
            setError("Api error");
          });
      } else {
        setError("Url is invalid");
      }
    }
  };

  const handleChange = (event) => {
    setLongUrl(event.target.value);
  };

  let buttonText = "Generate";
  if (shortUrl) {
    buttonText = "Make another";
  }

  return (
    <form onSubmit={genResult}>
    <Paper>
      <Box px={3} py={3}>
        <Typography variant="h5" align="left">
          Short Url Generator
          <br />
          <br />
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              id="long_url"
              label="Enter Url"
              value={longUrl}
              fullWidth
              margin="dense"
              onChange={handleChange}
              InputProps={{ readOnly: shortUrl !== "" }}
            />
          </Grid>
        </Grid>
        {isLoading && <CircularProgress color="primary" />}
        {error === "" ? (
          ""
        ) : (
          <div>
            <Alert variant="outlined" severity="error">
              {error}
            </Alert>
          </div>
        )}
        <div style={{ display: shortUrl ? "block" : "none" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="short_url"
                value={shortUrl}
                variant="outlined"
                fullWidth
                margin="dense"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3} mt={3}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start' }}>
                <Tooltip title="Copy to Clipboard">
                  <IconButton
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(shortUrl);
                    }}
                  >
                    <ContentCopyIcon fontSize="small"></ContentCopyIcon>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Open">
                  <IconButton
                    size="small"
                    onClick={() => openInNewTab({ shortUrl })}
                  >
                    <OpenInNewIcon fontSize="small"></OpenInNewIcon>
                  </IconButton>
                </Tooltip>
              </div>
            </Grid>
          </Grid>
        </div>
        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary" onClick={genResult}>
            {buttonText}
          </Button>
        </Box>
      </Box>
    </Paper>
    </form>
  );
}

export default Shortener;
