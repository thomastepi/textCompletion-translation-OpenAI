const express = require("express");
const dotenv = require("dotenv");

const app = express();

app.use(express.json());

// setup environtment variable
dotenv.config({path: '../.env'});

// openAIAPI configuration
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// build openai instance using OpenAIApi
const openai = new OpenAIApi(configuration);

// build runCompletion function which sends request to OPENAI Completion API
async function runCompletion(prompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 50,
  });
  return response;
}

// post request to /api/prompt
app.post("/api/prompt", async (req, res) => {
  // extract text from the request body
  const { text } = req.body;
  try {
    // pass request text to runCompletion function
    const response = await runCompletion(text);

    // send response back to frontend as a json object
    res.json({ data: response.data });
  } catch (error) {
    // handle error
    if (error.response) {
      console.error(error.response.data, error.response.status);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error("Something went wrong", error.messsage);
      res.status(500).json({ error: { message: "Something went wrong" } });
    }
  }
});



app.post("/api/translate", async (req, res) => {
    // extract text from the request body
    const { text } = req.body;
    try {
      // pass request text to runCompletion function
      const response = await runCompletion(text);
  
      // send response back to frontend as a json object
      res.json({ data: response.data });
    } catch (error) {
      // handle error
      if (error.response) {
        console.error(error.response.data, error.response.status);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error("Something went wrong", error.messsage);
        res.status(500).json({ error: { message: "Something went wrong" } });
      }
    }
  });






// set port
const PORT = process.env.PORT || 5000;

// start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
