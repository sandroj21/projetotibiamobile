const express = require('express');
const axios = require('axios');
const { DOMParser } = require('xmldom');
const xpath = require('xpath');

const app = express();
const port = 3000;

app.get('/character/:name', async (req, res) => {
    const characterName = req.params.name;
    const url = `https://www.tibia.com/community/?name=${characterName}`;

    try {
        const response = await axios.get(url);
        const doc = new DOMParser().parseFromString(response.data);
        
        const select = xpath.useNamespaces({"x": "http://www.w3.org/1999/xhtml"});

        const name = select("/html/body/div[3]/div[3]/div[3]/div[5]/div/div/div[1]/table/tbody/tr/td/div[2]/table/tbody/tr/td/div/table/tbody/tr[1]/td[2]/text()", doc).toString().trim();
        const world = select("/html/body/div[3]/div[3]/div[3]/div[5]/div/div/div[1]/table/tbody/tr/td/div[2]/table/tbody/tr/td/div/table/tbody/tr[7]/td[2]", doc).toString().trim();
        const residence = select("/html/body/div[3]/div[3]/div[3]/div[5]/div/div/div[1]/table/tbody/tr/td/div[2]/table/tbody/tr/td/div/table/tbody/tr[8]/td[2]", doc).toString().trim();
        const level = select("/html/body/div[3]/div[3]/div[3]/div[5]/div/div/div[1]/table/tbody/tr/td/div[2]/table/tbody/tr/td/div/table/tbody/tr[5]/td[2]", doc).toString().trim();
        const vocation = select("/html/body/div[3]/div[3]/div[3]/div[5]/div/div/div[1]/table/tbody/tr/td/div[2]/table/tbody/tr/td/div/table/tbody/tr[4]/td[2]", doc).toString().trim();
        const status = select("/html/body/div[3]/div[3]/div[3]/div[5]/div/div/div[4]/table/tbody/tr/td/div[2]/table/tbody/tr/td/div/table/tbody/tr[2]/td[3]", doc).toString().trim();
        
        // Continue com os outros campos de maneira similar, ajustando os XPath conforme necessário
        
        const characterData = { name, world, residence, level, vocation, status };
        
        res.json(characterData);
    } catch (error) {
        console.error('Error fetching character data:', error);
        res.status(500).send('Error fetching character data');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
