import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import axios from 'axios'

function DividerStack() {
  return (
    <div>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        <Card sx={{ display: 'flex', flexDirection: 'row', minWidth: 300 }}>
          <CardMedia
            component="img"
            sx={{ height: 200 }}
            image="./prathamesh.jpeg"
            alt="Martian"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography gutterBottom variant="h5" component="div">
                Prathamesh
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Team Lead
              </Typography>
            </CardContent>
          </Box>
        </Card>
        <Card sx={{ display: 'flex', flexDirection: 'row', minWidth: 300 }}>
          <CardMedia
            component="img"
            sx={{ height: 200 }}
            image="./harsh.jpeg"
            alt="Wonder Boy"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography gutterBottom variant="h5" component="div">
                Harsh
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Frontend Lead
              </Typography>
            </CardContent>
          </Box>
        </Card>
        <Card sx={{ display: 'flex', flexDirection: 'row', minWidth: 300 }}>
          <CardMedia
            component="img"
            sx={{ height: 200 }}
            image="/yash.jpg"
            alt="Dude"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography gutterBottom variant="h5" component="div">
                Yash
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Project Lead
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Stack>
    </div>
  )
}

export default function AboutUs() {
  const [news, setNews] = useState([])
  

  useEffect(() => {

    var config = {
      method: 'get',
      url: process.env.REACT_APP_NEWS_API,
      headers: {},
    }
    console.log(process.env.REACT_APP_NEWS_API)

    axios(config)
      .then(function (response) {
        console.log(response)
        const arr = []
        const articles = response.data.articles
        for (let x = 0; x < 3; x++)
          arr.push(articles[Math.floor(Math.random() * articles.length)])
        setNews(arr)
      })
      .catch(function (error) {
        console.log(error)
      })
  }, [])
  return (
    <React.Fragment>
      {news.length == 0 && (
        <img src={process.env.PUBLIC_URL + '/spinner.svg'} alt="csvg"></img>
      )}
      {news.length > 0 && (
        <Typography variant="h2" color="text.secondary" style={{ mb: '2rem' }}>
          News Section
        </Typography>
      )}
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
      >
        {news.length > 0 &&
          news.map((x) => (
            <Card
              sx={{ maxWidth: 345 }}
              onClick={() => window.open(x.url, '_blank')}
            >
              <CardMedia
                component="img"
                height="140"
                image={x.urlToImage}
                alt="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {x.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {x.description}
                </Typography>
              </CardContent>
            </Card>
            // </a>
          ))}
      </Stack>

      <br></br>
      <hr></hr>
      <br></br>
      <DividerStack />
      <div class="partnrs">
        <div class="container">
          <h3>A GLOBAL FOODBANKING NETWORK PARTNER</h3>
          <p>
            The Global FoodBanking Network seeks to create a hunger free world
            and actively assists food bank operations in over 40 countries
            across the globe to achieve the same. Bangalore Food Bank will
            follow and replicate the Global Food Banking Network's globally
            successful systems and practices in Bengaluru.
          </p>
          <ul>
            <li>
              <img src="https://seeklogo.com/images/T/the-global-food-banking-network-logo-B316B1B1D2-seeklogo.com.png" />
            </li>
            <li>
              <img src="https://www.indiafoodbanking.org/sites/default/files/india-food-banking-network-logo.png" />
            </li>
          </ul>
        </div>
      </div>

      <div class="misandvis">
        <div class="container">
          <div class="div_visdetails">
            <h4>OUR vision</h4>
            <p>
              Our vision is to{' '}
              <strong>
                Eradicate Hunger, Malnutrition & Prevent Food Wastage
              </strong>
            </p>
          </div>
          <div class="div_visdetails">
            <h4>OUR MISSION</h4>
            <ul>
              <li>
                <i class="fa fa-angle-double-right"></i> To create a supportive
                environment that will address the issues of hunger and
                malnutrition
              </li>
              <li>
                <i class="fa fa-angle-double-right"></i> To improve nutritional
                interventions by reinforcing the interaction between the various
                actors in the programme
              </li>
              <li>
                <i class="fa fa-angle-double-right"></i> To develop a
                sustainable system that ends food wastage at all levels of its
                supply chain from harvest to the consumption phase
              </li>
              <li>
                <i class="fa fa-angle-double-right"></i> To mobilize various
                resources and to build a culture of innovations to accomplish
                zero hunger
              </li>
              <li>
                <i class="fa fa-angle-double-right"></i> To create and promote
                nationwide awareness and to lend a voice to those who are not
                heard
              </li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
