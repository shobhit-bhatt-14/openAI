const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function getEntities(text) {
  const prompt =
    "From the text below, extract the following entities in the following format:\nCompanies: <comma-separated list of companies mentioned>\nCharacters: <comma-separated list of characters mentioned>\nCategory: <comma-separated list of toys category mentioned>\nText: ";

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

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  // let output =
  //   "\n\nCompanies: Kids Preferred \nCharacters: Lilo, Stitch \nToy Category: Activity Toy";

  try {
    let output = await getEntities(
      ` KIDS PREFERRED Disney Baby Lilo & Stitch - Stitch On The Go Activity Toy 12 Inches, Blue (KP79988) `
    );

    output = output.trim().split("\n");

    let product = {};

    for (let ele of output) {
      let key = ele.split(":")[0].trim();
      let val = ele.split(":")[1].trim();

      product[key] = val.split(",").map((v) => v.trim());
    }

    res.json(product);
  } catch (error) {
    res.json(error);
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI API active at http://localhost:${PORT}`);
});
