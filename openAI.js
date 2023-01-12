const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function getEntities(text) {
  const prompt =
    "From the text below, extract the following entities in the following format:\nCompanies: <comma-separated list of companies mentioned>\nCharacters: <comma-separated list of characters mentioned>Categories: <comma-separated list of toy category or type mentioned>\nText: ";

  const input = prompt + text;

  return await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: input,
      temperature: 1,
      top_p: 1,
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => res.data)
    .then((data) => data.choices[0].text)
    .catch((err) => console.log(err));
}

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/check", (req, res) => {
  res.send("OpenAI API is active");
});

app.post("/process", async (req, res) => {
  try {
    const { text } = req.body;

    if (text) {
      let output = await getEntities(text);

      output = output.trim().split("\n");

      let product = {};

      for (let ele of output) {
        let key = ele.split(":")[0].trim();
        let val = ele.split(":")[1].trim();

        product[key] = val.split(",").map((v) => v.trim());
      }

      res.json(product);
    } else {
      throw { message: "No text provided" };
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI API active at http://localhost:${PORT}`);
});
