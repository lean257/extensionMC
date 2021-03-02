const express = require('express')
const app = express()
const port = 3000
const axios = require('axios')

app.use(express.json());

app.post('/', (req, res) => {
  if (req.header('x-mc-action') == 'controls') {
    res.json({
      "controls": [
        {
          "number": {
            "name": "rating",
            "label": "Rating",
            "description": "Choose rating number to show",
            "min": 1,
            "max": 5,
            "default": 4
          }
        },
        {
          "enum": {
            "name": "favorite_color",
            "label": "Favorite Color",
            "description": "What is your favorite color?",
            "options": [
              {
                "label": "Blue",
                "value": "blue"
              }
            ],
            "default": "blue"
          }
        }
      ]
    })
  }
  else {
    // let num_biz = req.body.controlValues.num_biz

    res.send({
        type: 'TEXT',
        properties: {
          text: {
            type: 'doc',
            content: [
              {
                type: 'text',
                text: 'Hello world!',
              },
            ],
          },
        },
    })
  }
})

let imgSrc = '';
let API_KEY = "-QPl11oKmKSmT7oKLPv_LfmA4-BCletMeVwD9f61KU_HMHwdJXc7Ga30WVC7DekqMtCC0REsmrv75hMStbCGj1NiWiYTGFFx1IDbcGbQcL1Kk4YL4i9wvCB580U9YHYx";

let yelpREST = axios.create({
  baseURL: "https://api.yelp.com/v3/",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-type": "application/json",
  }
})

yelpREST("/businesses/search", {
  params: {
    location: "brooklyn, NY",
    term: "landscaping",
    limit: 5
  }
}).then(({data})=> {
  let {businesses} = data
  businesses.forEach(b=>imgSrc=b.image_url)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})