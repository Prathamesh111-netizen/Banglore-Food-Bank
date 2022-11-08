import React, { useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
} from "react-router-dom";
import { Container } from "react-bootstrap";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ServiceWorkerWrapper from "./ServiceWorkerWrapper";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ConfirmPage from "./pages/ConfirmPage.jsx";
import ShippingPage from "./pages/ShippingPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import PasswordResetPage from "./pages/PasswordResetPage.jsx";
import UserListPage from "./pages/UserListPage.jsx";
import UserEditPage from "./pages/UserEditPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import ProductEditPage from "./pages/ProductEditPage.jsx";
import ProductCreatePage from "./pages/ProductCreatePage.jsx";
import OrderListPage from "./pages/OrderListPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import aboutUs from "./pages/aboutus.jsx";

// import Allcampaigns from "./pages/CampaignPage.jsx";
// import CreateCampaign from "./pages/createCampaign.jsx";
// import EditCampaign from "./pages/editCampaign.jsx";

const App = () => {
	return (
		<Router>
			<Header />
			<ServiceWorkerWrapper />

			<main className="py-2">
				<Container>
					<Switch>
						{/*	<Route path="" element={<Allcampaigns />} />
						</Route> */}
						<Route path="/" component={HomePage} exact />

						{/* Campaigns Section */}
						{/* <Route path="/campaigns/edit/:campaignId" component={EditCampaign} exact />
						<Route path="/campaigns/create" component={CreateCampaign} exact />
						<Route path="/campaigns" component={Allcampaigns} exact /> */}

						<Route path="/search/:keyword" component={HomePage} exact />
						<Route path="/page/:pageNumber" component={HomePage} exact />
						<Route
							path="/search/:keyword/page/:pageNumber"
							exact
							component={HomePage}
						/>
						<Route path="/login" component={LoginPage} />
						<Route path="/register" component={RegisterPage} />
						<Route
							path="/user/password/reset/:token"
							component={PasswordResetPage}
						/>
						<Route path="/profile" component={ProfilePage} />
						<Route path="/aboutUs" component={aboutUs} />
						<Route path="/product/:id" component={ProductPage} />
						<Route path="/cart/:id?" component={CartPage} />
						<Route path="/user/confirm/:token" component={ConfirmPage} exact />
						<Route path="/shipping" component={ShippingPage} />
						<Route path="/payment" component={PaymentPage} />
						<Route path="/placeorder" component={PlaceOrderPage} />
						<Route path="/order/:id" component={OrderPage} />
						<Route path="/admin/userlist" component={UserListPage} exact />
						<Route
							path="/admin/userlist/:pageNumber"
							component={UserListPage}
							exact
						/>
						<Route path="/admin/user/:id/edit" component={UserEditPage} />
						<Route
							path="/admin/productlist"
							exact
							component={ProductListPage}
						/>
						<Route
							path="/admin/productlist/:pageNumber"
							component={ProductListPage}
							exact
						/>
						<Route path="/admin/product/create" component={ProductCreatePage} />
						<Route path="/admin/product/:id/edit" component={ProductEditPage} />
						<Route path="/admin/orderlist" component={OrderListPage} exact />
						<Route
							path="/admin/orderlist/:pageNumber"
							component={OrderListPage}
							exact
						/>
						<Route component={ErrorPage} />
					</Switch>
				</Container>
			</main>
			<Footer />
		</Router>
	);
};

export default App;
