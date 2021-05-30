const axios = require('axios');
const API_KEY =
  '-QPl11oKmKSmT7oKLPv_LfmA4-BCletMeVwD9f61KU_HMHwdJXc7Ga30WVC7DekqMtCC0REsmrv75hMStbCGj1NiWiYTGFFx1IDbcGbQcL1Kk4YL4i9wvCB580U9YHYx';

let yelpREST = axios.create({
  baseURL: 'https://api.yelp.com/v3/',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-type': 'application/json',
  },
});

async function getBizData() {
  try {
    const response = await yelpREST(
      `https://api.yelp.com/v3/businesses/search?term=eleven madison&location=new york`
    );
    let id_res = await response;
    const data = await yelpREST(
      `https://api.yelp.com/v3/businesses/${id_res.data.businesses[0].id}`
    );
    let biz_data = await data.data;
    return biz_data;
  } catch (err) {
    console.log(err);
  }
}

async function getRenderResp({ show_rating = true }) {
  const biz_data = await getBizData();
  const { image_url, url, rating, review_count, price, location } = biz_data;

  return {
    type: 'STACK_LAYOUT',
    children: [
      {
        type: 'IMAGE',
        properties: {
          alt: 'business image',
          src: `${image_url}`,
          href: `${url}`,
        },
      },
      {
        type: 'STACK_LAYOUT',
        children: [
          {
            type: 'TEXT',
            properties: {
              text: {
                type: 'doc',
                content: [
                  {
                    type: 'heading',
                    content: [
                      {
                        type: 'text',
                        text: `${biz_data.name}`,
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            type: 'TEXT',
            properties: {
              text: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [
                      {
                        type: 'text',
                        text: `${location.address1}, ${location.city}, ${location.state}`,
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            type: 'CLUSTER_LAYOUT',
            children: [
              ratingRender(show_rating, rating),
              {
                type: 'TEXT',
                properties: {
                  text: {
                    type: 'doc',
                    content: [
                      {
                        type: 'text',
                        text: `${review_count} reviews`,
                      },
                    ],
                  },
                },
              },
              {
                type: 'TEXT',
                properties: {
                  text: {
                    type: 'doc',
                    content: [
                      {
                        type: 'text',
                        text: `${price}`,
                      },
                    ],
                  },
                },
              },
            ],
          }, // end of outer cluster layout
        ],
      },
    ], // end of all outer children
  };
}

// allow rendering depending on control values
const ratingRender = (show_rating, rating) => {
  const star_icon_url = 'https://img.icons8.com/fluent/48/000000/star.png';
  if (show_rating) {
    return {
      type: 'CLUSTER_LAYOUT',
      properties: {
        spacing: 0,
      },
      children: [
        {
          type: 'TEXT',
          properties: {
            text: {
              type: 'doc',
              content: [
                {
                  type: 'text',
                  text: `${rating}`,
                },
              ],
            },
          },
        },
        {
          type: 'IMAGE',
          properties: {
            alt: 'star icon',
            src: `${star_icon_url}`,
            width: 15,
            maxHeight: 15,
          },
        },
      ],
    };
  } else {
    return;
  }
};
exports.getRenderResp = getRenderResp;
