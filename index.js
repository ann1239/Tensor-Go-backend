const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid"); // Import UUID generator

const app = express();
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// app.use(express.json());

// Endpoint to handle POST requests from React frontend
app.post("/api/receive-post", async (req, res) => {
  // Log the contents of the POST request body
  console.log("Received POST request with body:", req.body);

  const { category, comments } = req.body;

  //   const userId = uuidv4(); // Generate a UUID for user ID

  const userId = "6675cdef0ca6a1ce3428bfe9";

  try {
    // Send message to Intercom
    const intercomApiKey =
      "dG9rOmIzNGMwODZiX2Y1NzlfNGU0Yl84NWEzX2M0M2Q1MDdhNmI3NToxOjA=";
    const intercomBaseUrl = "https://api.intercom.io";

    // const email = "jacobpaul75608@gmail.com";

    // try {
    //   const response = await axios.post(
    //     `${intercomBaseUrl}/contacts`,
    //     {
    //       email: email,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${intercomApiKey}`,
    //         Accept: "application/json",
    //         "Content-Type": "application/json",
    //         "Intercom-Version": "2.11",
    //       },
    //     }
    //   );

    //   console.log("Contact created:", response.data);
    //   // return response.data;
    // } catch (error) {
    //   console.error(
    //     "Error creating contact:",
    //     error.response ? error.response.data : error.message
    //   );
    //   throw error;
    // }

    const message = {
      body: `User has submitted a ${category}: Additional comments: ${comments}`,
      from: {
        type: "user",
        id: userId,
      },
    };

    const response = await axios.post(
      `${intercomBaseUrl}/conversations`,
      message,
      {
        headers: {
          Authorization: `Bearer ${intercomApiKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Intercom-Version": "2.11",
        },
      }
    );

    console.log("Message sent to Intercom:", response.data);

    // Optionally, you can send a response back to the client
    res.status(200).send("Message sent to Intercom successfully.");
  } catch (error) {
    console.error("Error sending message to Intercom:", error.response.data);
    res.status(500).send("Failed to send message to Intercom.");
  }
});

app.get("/api/receive-chat", async (req, res) => {
    const userId = "6675cdef0ca6a1ce3428bfe9";
  
    const query = new URLSearchParams({
      per_page: "20",
    }).toString();
  
    try {
      const intercomApiKey =
        "dG9rOmIzNGMwODZiX2Y1NzlfNGU0Yl84NWEzX2M0M2Q1MDdhNmI3NToxOjA=";
      const intercomBaseUrl = "https://api.intercom.io";
  
      const response = await axios.get(
        `${intercomBaseUrl}/conversations?${query}`,
        {
          headers: {
            Authorization: `Bearer ${intercomApiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Intercom-Version": "2.11",
          },
        }
      );
  
      console.log("Message sent to Intercom:", response.data);
    //   console.log("Message sent to Intercom:", response.data.data.data.conversations);
  
      // Send a response back to the client
      res.status(200).send({ message: "Message sent to Intercom successfully.", data: response.data });
    } catch (error) {
      // Check if error.response is defined before accessing its properties
      const errorMessage = error.response ? error.response.data : "Unknown error";
  
      console.error("Error sending message to Intercom:", errorMessage);
  
      // Send an error response back to the client
      res.status(500).send("Failed to send message to Intercom.");
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
