import React, { Component } from "react";
import Slider from "react-slick";
import { HashLink as Link } from 'react-router-hash-link';
import image2 from "../assets/gallery01.jpeg";
import image1 from "../assets/gallery02.jpeg";
import image3 from "../assets/gallery03.jpeg";
import "../styles/multi.css";
import Carousel from 'react-bootstrap/Carousel';

export default class PauseOnHover extends Component {
	render() {
		var settings = {
			dots: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 2000,
			pauseOnHover: true
		};
		return (
			// style={{  }}
			<div style={{ textAlign: "center", textDecoration: "none" }} >
				{/* <a href="#products" > */}
					<button class="button-18" onClick={() => window.location.replace("/#products")}>DONATE NOW</button>
				{/* </a> */}
	
				<Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={image1}
          alt="First slide"
        />
        {/* <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption> */}
      </Carousel.Item>
      {/* <Carousel.Item>
        <img
          className="d-block w-100"
          src="holder.js/800x400?text=Second slide&bg=282c34"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item> */}
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={image2}
          alt="Third slide"
        />

      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={image3}
          alt="Third slide"
        />

      </Carousel.Item>
				</Carousel>
				
				{/* <Slider {...settings}>
					<div>
						<img
							src={image1}
							style={{ width: "100%", height: "500px" }}
							alt="_image"
						/>
					</div>
					<div className="Stats">
						<h1 className="title">No. People Fed So Far</h1>
						<p className="count">100K+</p>
						<h1 className="title">No. of People Fed Last month</h1>
						<p className="count">10K+</p>
					</div>
					<div>
						<img
							src={image2}
							style={{ width: "100%", height: "500px" }}
							alt="_image"
						/>
					</div>
					<div className="Stats">
						<h1 className="title">No. of Campaigns conducted</h1>
						<p className="count">50+</p>
						<h1 className="title">Donations through Campaigns</h1>
						<p className="count">1M+</p>
					</div>
					<div>
						<img
							src={image3}
							style={{ width: "100%", height: "500px" }}
							alt="_image"
						/>
					</div>
				</Slider> */}
				<div className="products" id="products" style={{ marginTop: "100px" }}>
					<h1 className="title">Food Items</h1>
				</div>
			</div>
		);
	}
}
