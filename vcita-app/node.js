const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 5000;

const dotenv = require('dotenv');

dotenv.config(); 

const vcitaConfig = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    hostDomain: process.env.HOST_DOMAIN,
};


app.use(express.json());

// redirect for auth
app.get('/api/auth', (req, res) => {
    const authUrl = `${vcitaConfig.hostDomain}/oauth/authorize?client_id=${vcitaConfig.clientId}&redirect_uri=${vcitaConfig.redirectUri}&response_type=code`;
    res.redirect(authUrl);
});


// callback auth for token
app.get('/api/auth/callback', async (req, res) => {
  const authCode = req.query.code;

  try {
      const response = await axios.post(`${vcitaConfig.hostDomain}/oauth/token`, {
          client_id: vcitaConfig.clientId,
          client_secret: vcitaConfig.clientSecret,
          redirect_uri: vcitaConfig.redirectUri,
          code: authCode,
          grant_type: 'authorization_code'
      });

      const accessToken = response.data.access_token;
      res.json({ accessToken });
  } catch (error) {
      res.status(500).json({ error: 'Failed to obtain access token' });
  }
});

// for clients's list
app.get('/api/clients', async (req, res) => {
  try {
      const response = await axios.get(`${vcitaConfig.hostDomain}/api/v1/clients`, {
          headers: {
              Authorization: `Bearer ${req.headers.authorization}` // pass the token
          }
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// create a new client
app.post('/api/clients', async (req, res) => {
  const clientData = req.body;

  try {
      const response = await axios.post(`${vcitaConfig.hostDomain}/api/v1/clients`, clientData, {
          headers: {
              Authorization: `Bearer ${req.headers.authorization}`
          }
      });
      res.json(response.data);
  } catch (error) {
      res.status(500).json({ error: 'Failed to create client' });
  }
});

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
