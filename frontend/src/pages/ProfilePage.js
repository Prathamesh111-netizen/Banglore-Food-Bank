import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
	Form,
	Button,
	Row,
	InputGroup,
	Col,
	Card,
	Table,
	Image,
	FloatingLabel
} from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
	sendVerficationEmail,
	getUserDetails,
	updateUserProfile,
	refreshLogin
} from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";
import { USER_PROFILE_UPDATE_RESET } from "../constants/userConstants";
import Meta from "../components/Meta";
import axios from "axios";
import getDateString from "../utils/getDateString";
import "../styles/profile-page.css";

const ProfilePage = ({ history }) => {
	const inputFile = useRef(null);
	const [showSubmitButton, setShowSubmitButton] = useState(false); // sisable the submit button unless some user detail is changed by user
	const [typePassword, setTypePassword] = useState("password");
	const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [avatar, setAvatar] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState(null);
	const [allOrders, setAllOrders] = useState([]);

	const [uploading, setUploading] = useState(false);
	const [errorImageUpload, setErrorImageUpload] = useState("");
	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, user, error } = userDetails;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userProfileUpdate = useSelector((state) => state.userProfileUpdate);
	const { success } = userProfileUpdate;

	const orderListUser = useSelector((state) => state.orderListUser);
	const {
		loading: loadingOrdersList,
		orders,
		error: errorOrdersList
	} = orderListUser;

	// check whether verification email has to be sent
	const userSendEmailVerfication = useSelector(
		(state) => state.userSendEmailVerfication
	);
	const { emailSent, hasError } = userSendEmailVerfication;

	// refresh access token for user details error
	useEffect(() => {
		if (error && userInfo && !userInfo.isSocialLogin) {
			const user = JSON.parse(localStorage.getItem("userInfo"));
			user && dispatch(refreshLogin(user.email));
		}
	}, [error, dispatch, userInfo]);

	// set orders to local state
	useEffect(() => {
		if (orders && orders.length) {
			setAllOrders([...orders]);
		}
	}, [orders]);

	// check if any of the input fields value is changed, only then show the submit button
	useEffect(() => {
		if (userInfo) {
			if (name && userInfo.name !== name) setShowSubmitButton(true);
			else if (email && userInfo.email !== email) setShowSubmitButton(true);
			else if (password || confirmPassword) setShowSubmitButton(true);
			else setShowSubmitButton(false);
		}
	}, [name, email, password, confirmPassword, userInfo]);

	useEffect(() => {
		dispatch(listMyOrders());
	}, [dispatch]);

	useEffect(() => {
		if (!userInfo) {
			history.push("/login");
		} else {
			// if user is null, first fetch it and then set its details to the local state
			if (!user || !user.name || success) {
				dispatch(listMyOrders());
				dispatch({ type: USER_PROFILE_UPDATE_RESET });
				userInfo
					? userInfo.isSocialLogin
						? dispatch(getUserDetails(userInfo.id))
						: dispatch(getUserDetails("profile"))
					: dispatch(getUserDetails("profile"));
				if (success) {
					userInfo.isSocialLogin
						? dispatch(getUserDetails(userInfo.id))
						: dispatch(getUserDetails("profile"));
				}
			} else {
				setName(user.name);
				setEmail(user.email);
				setAvatar(user.avatar);
			}
		}
	}, [history, userInfo, user, dispatch, success, loadingOrdersList]);

	const showHidePassword = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setTypePassword(typePassword === "password" ? "text" : "password");
	};

	const showHideConfirmPassword = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setTypeConfirmPassword(
			typeConfirmPassword === "password" ? "text" : "password"
		);
	};

	// handle file upload to aws bucket
	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("image", file);
		setUploading(true);
		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data"
				}
			};

			const { data } = await axios.post("/api/upload", formData, config);
			setAvatar(data);
			dispatch(
				updateUserProfile({
					id: user.id,
					avatar: data
				})
			);
			setUploading(false);
		} catch (error) {
			setErrorImageUpload("Please choose a valid image");
			setUploading(false);
		}
	};

	// handle image overlay div's click to upload new file
	const handleImageClick = () => {
		inputFile.current.click();
	};

	// update user details
	const handleSubmit = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Passwords do not match. Please retry.");
		} else {
			dispatch(
				updateUserProfile({
					id: user.id,
					name,
					email,
					avatar,
					password,
					confirmPassword
				})
			);
		}
	};

	return (
		<Row className="mt-2">
			<Meta title="My Profile " />
			{userInfo && !userInfo.isConfirmed ? (
				<>
					{emailSent && (
						<Message variant="success" dismissible>
							A verification link has been sent your mail!
						</Message>
					)}
					{hasError && (
						<Message dismissible variant="danger">
							{hasError}
						</Message>
					)}
					<Card style={{ margin: "0" }} className="mb-3">
						<Card.Body className="ps-0 ">
							<Card.Title style={{ fontWeight: "bold" }}>
								Account Not Verified
							</Card.Title>
							<Card.Text>
								{`${userInfo.name}, `} your account is not yet verfied. Please{" "}
								<Button
									variant="link"
									className="p-0"
									style={{
										fontSize: "0.9em",
										margin: "0 0 0.1em 0",
										focus: "none"
									}}
									onClick={() => dispatch(sendVerficationEmail(userInfo.email))}
								>
									click here
								</Button>{" "}
								to send a verfication email.
							</Card.Text>
						</Card.Body>
					</Card>
				</>
			) : null}
			<Col
				md={3}
				style={
					userInfo && !userInfo.isConfirmed
						? {
								opacity: "0.5",
								pointerEvents: "none"
						  }
						: {
								opacity: "1",
								pointerEvents: ""
						  }
				}
			>
				<h2 className="text-center">My Profile</h2>
				{message && (
					<Message dismissible variant="warning" duration={8}>
						{message}
					</Message>
				)}
				{error && error !== "Not authorised. Token failed" && (
					<Message dismissible variant="danger" duration={10}>
						{error}
					</Message>
				)}
				{success && (
					<Message dismissible variant="success" duration={8}>
						Profile Updated!
					</Message>
				)}
				{loading ? (
					<Loader />
				) : (
					<div style={{ display: "flex", flexFlow: "column nowrap" }}>
						{errorImageUpload && (
							<Message dismissible variant="danger" duration={10}>
								{errorImageUpload}
							</Message>
						)}
						{uploading ? (
							<Loader />
						) : (
							<div
								className="profile-page-image"
								style={{ alignSelf: "center" }}
							>
								<Image
									src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw4ODg4OEA8PERAOEBEODg4QEBAQEBEQFxYXFxYWFxYZHioiGRsnHBYYIzMkJy0tMDAwGCE2OzYvOi0vMC0BCwsLDw4PHBERHC8oIicxLy8tMS8vLy8xLzEvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAOEA4AMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcDBQgEAQL/xABIEAACAgECBAIGBQkECAcBAAABAgADBAURBhIhMQcTIkFRYXGBFDKRk9IXIzNCVGJyocFSorHRFRZDVYKSlLJTY3N0s8LhNv/EABkBAQADAQEAAAAAAAAAAAAAAAACAwQBBf/EACkRAAICAQMDAwQDAQAAAAAAAAABAhEDEiExBEFRE3GBFCIyQmGxwaH/2gAMAwEAAhEDEQA/ALxiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiJpOJeJ8PTa+fItAYglKl9K1/4V/qek6k3sjjaW7N3PPlZtVK81tldaj9Z3VB/MylNb8UNSzWevBqNFYBYmtTbfyjuS3ZR8B85X+ZmXXtz222Wsf1rHZz9pl8enb5dGeXUxXCs6IzfEPR6ejZlbH2VrZb/NQRNa/i1pA7NkH3ik/wBTKCiW/Tx/kqfUzOgKvFfR272XJ72oc/8AbvNxgcbaTfsK82jc9ldvKb7H2nM8Q+niF1Mu6R1tXYrgMrBgexUgg/MTJOVdK1zMw2DY+RdVt+qrnkPxXsfslk8N+Lrqwq1GncdB59KlWX3vWT1+I+yUy6eS43LodRF87FwxPHpmo0ZVS3UWJZW3Z0O4+B9h909koNAiIgCIiAIiIAiIgCIiAIiIAiIgCIml4s1xNOwrsp+pQctSf27G6Iv2/wAgZ1K9kcbpWzQ+InHdelp5NXLZluu6oeq1Kezv/QeuQ3h7gDIzydR1e5662HmMtjctjJ7WJ/RLt6vZ7J7/AA04WbLsfWs/849rs+Oj9QTv+lIPqHZR7vhND4o8cNnWPh47kYtTcrsD+ncev3oD29vf2TTFU9EPl/4ZZSta5/CPRr/H9GKjYejU101D0XyuQFn9R5Qw6/xNuZW7MSST3J3PxnyJojBR4M05uXIiIkiAiIgGTHuat0sXbmrZXXmUMu4O43B6Ee6W7ompaXxIgx82iurOVfQtr9BrNh9ZG9f8B3lPT90XPWy2IxV0YMjqdirDsQZCcFL3LIZNPsWFm6XqnDF/0ihzdiOwDtsfLcepbV68jdejD/8AJbfCvEWPqeOuRSdv1bKyfTrf1qf8/XNJwDxNVrOE9V6o11airKqYArYp6B9vYdvkd5CszGs4X1au6ss2BlnkYHc7V7+kp/eXuD6x85ma1/a/yX/TVF6Puj+P9F1RMdViuqupBVwGVh2KkbgzJM5pEREAREQBERAEREAREQBERAEqzxXZ8zUNL0pT6Nri20D95uXf5KHPzlpyoNX1WscXUHlZ/L8vF2GwIsdCARv6h5gP2y3D+V+EyrN+KXlpG+8U9cXTdOrw6PQsyF+j1BehrpUAMR8th85Q0l3irq/0vVbwDumNtjJ7PQJ5/wC8T9kiM1YY6Y+5jzT1T9hERLSk/VaFmVVBLMQqqO5YnYCWBxv4dthYWNl0gtyUouco68tnrsHu3Ox+APtmfwe4TOReNQtX8zjt+YBH17h2I9oX/Hb2S7XQMCrAFWBBBG4IPcETNlzaZJLtya8OFSi2+5yTEsPxI8PXwmfLxELYpO9lY3LUf5p7/VK8miMlJWjPODi6YiInSBveCdebTs6nI3Pl83l3qOzVt0b7O/yl7eIGkpn6XkIAGZKzkUH99AWGx943HznNkv8A4M4gDcPDJsDWfRKba7VG3MwqB9v7u0zZ401JGrp5WnF8Gfwk1M5Ok0hju2Oz45+C7FP7rAfKTSVd4F5KtRn1jcFchbdvYrrsOv8AwmWjKMqqbNOJ3BCIiVlgiIgCIiAIiIAiIgCIiAfixwqlmICqCzE9gB1JnNudxQH1o6otfojIS1K+xZEAUb+wkLv85d/iPkPXpGc1e/MauQkdwrMFY/YTOa5q6eNpt+xk6mdNJe5lzLzbbbYe9tj2H4sSf6zFETUZBJhwBwLbqji2zmrxEb85b2NhHdK/6n1Tz8H8EZupfna0rWlG2Nl/MK3Yd1AHVvf6vfLao0jiCtFrrzsBEQBURcUhVUdgBKcuStk1ZfixXvJbEwwcOuipKakVK61CoijYACeiQPJv4hwVN1n0XOpQc1tVKNVcE9ZT2kD1SV6HqtOdj15NJ3SwbgH6ykdGUj1EHcTG4tbm1ST2PcyhgQQCCNiCNwR7CJVPHHhYHLZOnAKx3azEOwVj33rJ+r/Cenwk84r4iTTqUbka265xVjY6fXttPYe4e0zS1U8S3DzDfg43N1FPlNaVHsLe2Sg5R3TojkUZfa1ZQGTj2VWNVYjJYh5XRwVZT7xMcu3iHgfVdQUDIycB2X6lgxmS1fcHHXb3SruIuFMzTrRVeigMrPXarb1uF7hWP63u7zZDIpdzDkxSjv2NHJ3wlxJTi6JqmK7jzriVpqO+7CxBWxHw7yCRJyipKmQjJxdotbwI1CpXzMY9LLRXanX6ypzAgfDm3+cuSct8J6i2JqGJeu+6XICB3KseVh7+hM6kmPPGpX5NvTSuFeBERKDQIiIAiIgCIiAfJ9iIAifJ9gHi1fBXJxr8dttrqnrO/wC8CN5ymyMpKsNmUlWB7gjoROuZzR4iaf8ARtWzawNlazzU/hsAf/En7Jp6Z8oy9VHZMjk92i6ZZmZFeNX9e3n5d/aqM2392eGbHhzUDi5uLkA/ob63b+DfZh/ykzU7rYyRq1Zf3hnk02aTiLVsDUnk2p2ZLV+sGHt36/OSuQ7UuCle98zBy7sG670rWp2eq0nrzNWem8wf6ra3/v6z/paZgai3dnopySpomd9qVozuwVEUs7MdgFA3JMrjgPBz7aMm7Fy0x8a/MyLaK3xhduhbbmBLDYHbbb3TZHgXJyNlz9UycqkHc46qtCP7mK9SJNMXHSmtKq1VK61CIijYKo6ACctRVLcU5PfYrzVKsjE1nSbs/JS+lvPpqsFApSq5l9Hf0j1PTr7pZM12taTj51D4+Qgep+43IIYdmBHUEe2RZeDdSpArxtbyK6V6JXbVXcyj1DmPedtS70EnHhWTqVr43XVNhUY+wa97vNqUdWCIj87fDbpNl/qtrX+/rf8ApaZreIuGqdO03Ucyy23JzLcdqTlXtuwDkLyovZR1+M7BRUk7s5NycWqKPiIm880kvhxp30rVsNCN1R/Of+GsFh/MCdKymfAfT+a7LyiOlaJQh/eY8zfyA+2XNMWd3M9Dp41C/IiIlBeIiIAiIgCIiAfJ9nyfYAiIgCUr47YHJk4uSB0tqapj+8h3H8m/lLqke4z4ar1TEahzyup56Le/JYOx94PYiTxy0yTZXlhri0czRPbrWk34N7499ZSxD2PZl9TKfWp9s22jcDanm1V3UUBqbd+S021KvQlTuCdx1B9U9DUkrs87S3skXvwJqH0rTMO0ndvKVH/jT0T/AISQSnPDrXLtHyG0rUEalLHLUO/1VsO24Ddije31H4y4hPPyRqR6OOWqP9n2IiQLBERAEqzxz1cJj4+Crenc/nuP/LTcLv8AFj/dliavqdOHRZkXOErrG5J7k+pQPWSegE5y1vLy9YysrNFNjqil2CgstNK/VBPuH9Zdghb1dkUZ51HSuWaGIkq4D4Lu1W4Ehkxa2HnXbd9u6J7WPt9U2ykoq2YYxcnSLa8IdN8jSKWI2bId72+BPKv91R9sm0wYeMlNaU1qFStFrRR2CqNgJnnmydts9OK0pIREThIREQBERAEREARPk+wD5PsRAEREAj/FfCeLqqVJfzjynLq1ZVX2IIK7kHp/lPfoWj0YGOmNQCtVfMQGYsxJJJJJ95mxidt1XY5pV2eHU9Lx8uvysilLUP6tig7H2j2H3iefS9I+iAJVdY1Q6LVcfN5B7Fc+kB7iTM2raxi4aeZkXpUvq5z1PwHc/KRPE8SaMvLqw8Gi297G2Nj/AJmpEHVnO4LbAb+ob9JJRk1twRk4p78k8iJA+MfEvG0604yVNkXpt5ih/LRCeoBbY7n3ATkYuTpHZSUVbJ5EgXCvifh5xau5foliqXHmWBq2A77PsOvuMya94n6ZjI3lWjItH1UrD8p69QbNth/Od9OV1Rz1IVdns1fgpdQtWzOybrq0O9eLXtTQvxA3Zj795D/EriHEwcVtHwFrQ2dMjygAtaetSR3c+vf1d+80PE3irm5atXQoxamGxKtz3MP49hy/IfOfjgTw8u1FkyckmvFJ5t9wbL/aB13Ue1jL4wcVeR7LhGeU9Tcca3fLPR4beH9eo025GV5iUn0Mc1sFZmBPM3UHcDt8d5dOlYFeLRVj1jZKUWte25AG2529ZmbExq6a0qqRUrrUIiKNgqjsBM8oyZHNl+PGoL+RERIFgiIgCIiAIiIAiIgHyfYiAfJ9iIAiJhyL0qRrHYKiKWdidgqgbkmALrkrRrHZVRAWZ2IVVA7kk9hKn4y8WTu9GnAdN1OW43+dan/E/ZIx4h8d26lY1NJavDQ7Km5DXEfrv7vYv9ZCprxYFzIx5eob2iZs3MtvdrbrHtsbqzuxZj8zLv8ACDhf6Ji/TLV2vy1BUEdUp7qPcW7/AGStPDfhr/SWciOB5FAF1/b0lB6J8z/LedHKAAABsB0AHqE51E/1Q6bH+7P1ObPEXR78TUcprFfkvue6q4g8jq5LbBu2432I906TmHIx67V5XRHX+y6hh9hlOPJoZflx61RzTwfwtfqt4qrBStQWsvKE11gdhv2LH2SyMPwYxgQbsu1/aqIifzO8s+ihK15URUUdlRQo+wTLJSzyfGxGHTxS33OdvEzhFNLyK/JD/R703rLHmKuoAdSfsPzmk4f4kzdPfnxr2QE7tWfSqf8AiU9Pn3l8+JWiDO0y9dh5lK/SKmO3Rk6kb+9dx85zhNGKWuO5mzR0TtF/8FeI2NqPLTdy4+SegQt+bsP7jH1/un+cnc5GUkEEEgg7gjoQZcvhh4gm8pgZj73fVx72P6X2I5/tew+v496suGt4l2LPf2yLUiImY1CIiAIiIAiIgCIiAIiIAiIgCU34z8WFn/0ZS3oJs+WR+s3da/gO5+UtXXNRTDxb8l/q01tZt7SB0HzOw+c5Zy8my6yy2xi1lrGyxj62J3M0YIW9T7GbqJ1Gl3MURE2GE9Om6hdi2pdRY1VqHdXXv8COxHuMvHgPxGp1Dlx8jlpyuw67V2n90ns37v2ShYB26+sdQZXPGprctx5XDg66iQrwmzsrI0xLcm02nzHSp26v5a7D0j+sd9+smswSVOj0Yu0mJ4dV1OjDpe++xa60HVmPc+oAesn2Ce6c8eLGdlvqd1N1paupgcesdEWthuDy/wBrrsT36SeOGuVEMuTRGz7x54gX6mzU1c1OID0r/Xt9jWH/AOvb4yFxE3xioqkedKTk7Yn1GKkMCQVIKkdCCOxE+ROkTorw14o/0lhDzCPpGPtXePW39l9veB9oMmE5y8L9bOFqdG7bVZB+j2j1el9Q/JtvtM6NmDLDTLbg9HDPXHcRESouEREAREQBERAEREAREQCAeNWaatK8sH9PdXWf4Ru5/wC0ShJ0lx1wmNXpppNxpFVhs3Cc/N6JXbuPbIZ+RVP29vuB+KasOSEY0zJmxTnK0VBEt/8AIqn7e33A/FH5FU/b2+4H4pb68PJT6GTwVBEt/wDIqn7e33A/FH5FU/b2+4H4o9fH5H0+TwQDhHi/L0qzmqbnpY/nMdz6D+8f2W94/nL64a4qxdSp82h9mXl82pthZWSeu49nv7SCfkVT9vb7gfimSnwcNZJTUbULKVYrVykqe4OzdR7pTkeKe97l2NZYbVt7mTj3xQSjnxcBle3qtmT0auv28nqZvf2HvlOZF72O1ljs7uSzuxJZmPcky2/yKp+3t9wPxR+RVP29vuB+KShPFBbMjPHlm90VBEt/8iqft7fcD8UfkVT9vb7gfilnr4/JX9Pk8FQRLf8AyKp+3t9wPxR+RVP29vuB+KPXh5H0+TwVAGK+kDsR1UjuCOxnWGm5XnUU3f8Ai1JZ/wAyg/1lXfkVT9vb7gfilm6NhfRsbHx+bn8ipKucjYtyqBvt6u0oz5IzqjRgxyheo90REzmkREQBERAEREAREQBERAEREASPcc66NO0+/IDAWcvl0Ajfe5ui9PXt3+AkhlMeLesnI1DHwa0suqwyt2RTUCxdzsSOgPZOm+3TnMnjjqlRXklpjZI/C3jDIz2ycbMYHITltrHItZNJABGw9h2P/HM3itxJmadXhti2KjXWuj8yI+4AG31h06mV/l8UOms4+q/RL8Ss+XTkLYG5XXqrbbqP1AOn7klPjjYrUaY6kFWudlI7EFVIMu0L1I7bMq1v05b7ox5Os8V4CNlZNNNtCdbEAqPKvctvWdx0B69QN+0kmpcX+doV2p4Z5LFQdGAc1WB1VlIPQ9/mCDNzxHxDh4mLbbbbWV5GUVqys1jFTsirv1J2Mq7QcWxOFNUsYEJfbz1Kd/qh61JHu3B+yRVSSbXdEpXFtJ9n8Es8MOOG1Cu6rKdPpFANnP6KCyn1tygADl6A/ETSab4i5WZrlWPU6rhWXtUq8iMzoqt6fMRuObYHb1TS/wCpl+RpemZuCGF1qHFyFQsCyPa6Bzt+qAdm/d6ntPfbolWn8RaHi17fm8WvncAA2WFsnmc+8n+klphbfvt4ohqnSv8Aj5slmRxFlrxJTpwsX6M9JsavkTmLeVY31tt+6iaTiHxCycDW7Mewh8Ks1q9QRA6q1aksG23OxO+3r7TNmf8A9nj/APtz/wDBbNfl6RVncUahi3DdLcUjcdCreVVsw94M5FR7r9SUnLhP9iT+JXE12Hp9GVhWp+euQLZypYrVsjN036eoSY4Vheqp27siMT26kAmc7cUWZ2DS+i5O7pRet2Nad+Xy+Vh6G46qebf3EETojTf0FP8A6Vf/AGiQyR0xXz/hLHPVJ/B6YiJUXCIiAIiIAiIgCIiAIiIAiIgCIiAJHND4Sx8PLyM1Wstvyd/MstKnl3bmIXYDYHp/yiSOJ1No40mafiXQKNSxzjXhuQsrqyEB0ZexUkdOhI+BM1WrcCYuZiYmJddeUwwVqcMgcrsFAY8vXYAD5SWxCk1wzjinyV/h+EmlVWB28+0D/Z2WAKTuD15QCfh75K9X0SnKw7MFgUpdFTarZSqqQQF6bD6om1idc5N22FCKVJGt0HSq8HGqxaixrpBVCxBYgsW67D3zwahwrj36jj6k72i7GQV1qrKKyAXPUbb/AO0Pr9kkMTlu7O0qo0FnCuO2ppqpazz0Tywu6+XtyMnbbfsx9cUcK46alZqge3z7E8tlJXy9uVV6Dbfso9c38Rqfk5pRHuLOEsTVVrXIDg1EmuyshXUH6w6ggg7D7JvKKgiIg32RQo377AbTLEW6o7S5ERE4dEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREA//9k="
									alt={name}
									style={{
										height: "5em",
										width: "5em",
										marginBottom: "1em",
										border: "1px solid #ced4da",
										borderRadius: "50%",
										cursor: "pointer"
									}}
								/>
								<div className="image-overlay" onClick={handleImageClick}>
									Click to upload image
								</div>
							</div>
						)}
						{/* for image upload */}
						<input
							type="file"
							accept="image/*"
							id="file"
							ref={inputFile}
							onChange={handleImageUpload}
							style={{ display: "none" }}
						/>
						<Form onSubmit={handleSubmit}>
							<Form.Group controlId="name">
								<FloatingLabel
									controlId="nameinput"
									label="Name"
									className="mb-3"
								>
									<Form.Control
										size="lg"
										placeholder="Enter Name"
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</FloatingLabel>
							</Form.Group>
							<Form.Group
								controlId="email"
								className="my-2"
								style={
									userInfo && userInfo.isSocialLogin
										? {
												pointerEvents: "none",
												opacity: "0.8"
										  }
										: {}
								}
							>
								<FloatingLabel
									controlId="emailinput"
									label="Email"
									className="mb-3"
								>
									<Form.Control
										size="lg"
										placeholder="Enter Email Address"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</FloatingLabel>
							</Form.Group>
							{userInfo && !userInfo.isSocialLogin && (
								<>
									<Form.Group>
										<InputGroup className="d-block">
											<FloatingLabel
												controlId="passwordinput"
												label="Password"
												style={{ display: "flex" }}
												className="mb-3"
											>
												<Form.Control
													size="lg"
													type={typePassword}
													placeholder="Enter your password"
													value={password}
													style={{
														borderRight: "none",
														width: "100%"
													}}
													onChange={(e) => setPassword(e.target.value)}
												/>
												<div className="input-group-append">
													<InputGroup.Text
														onClick={showHidePassword}
														style={{
															fontSize: "1rem",
															height: "100%",
															marginLeft: "-0.5em",
															background: "transparent",
															borderLeft: "none"
														}}
													>
														{typePassword === "text" ? (
															<i className="far fa-eye-slash" />
														) : (
															<i className="far fa-eye" />
														)}
													</InputGroup.Text>
												</div>
											</FloatingLabel>
										</InputGroup>
									</Form.Group>
									<Form.Group>
										<InputGroup className="d-block">
											<FloatingLabel
												controlId="confirmpasswordinput"
												label="Confirm Password"
												style={{ display: "flex" }}
												className="mb-3"
											>
												<Form.Control
													size="lg"
													type={typeConfirmPassword}
													placeholder="Confirm password"
													value={confirmPassword}
													style={{
														borderRight: "none"
													}}
													onChange={(e) => setConfirmPassword(e.target.value)}
												/>
												<div className="input-group-append">
													<InputGroup.Text
														onClick={showHideConfirmPassword}
														style={{
															fontSize: "1rem",
															height: "100%",
															marginLeft: "-0.5em",
															background: "transparent",
															borderLeft: "none"
														}}
													>
														{typeConfirmPassword === "text" ? (
															<i className="far fa-eye-slash" />
														) : (
															<i className="far fa-eye" />
														)}
													</InputGroup.Text>
												</div>
											</FloatingLabel>
										</InputGroup>
									</Form.Group>
								</>
							)}
							<div className="d-grid mb-3">
								<Button
									type="submit"
									disabled={!showSubmitButton}
									style={{
										padding: "0.5em 1em"
									}}
								>
									Update Profile
								</Button>
							</div>
						</Form>
					</div>
				)}
			</Col>
			{/* display orders */}
			<Col
				md={9}
				style={
					userInfo && !userInfo.isConfirmed
						? {
								opacity: "0.5",
								pointerEvents: "none"
						  }
						: {
								opacity: "1",
								pointerEvents: ""
						  }
				}
			>
				{allOrders.length ? (
					<>
						<h2 className="text-center">My Orders</h2>
						{loadingOrdersList ? (
							<Loader />
						) : errorOrdersList ? (
							<Message dismissible variant="danger" duration={10}>
								{errorOrdersList}
							</Message>
						) : (
							<Table
								striped
								bordered
								responsive
								className="table-sm text-center"
							>
								<thead>
									<tr>
										<th>DATE</th>
										<th>TOTAL</th>
										<th>PAID</th>
										<th>DELIVERED</th>
										<th>ACTION</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order, idx) => (
										<tr
											key={idx}
											style={{
												textAlign: "center",
												padding: "0"
											}}
										>
											<td>{getDateString(order.createdAt)}</td>
											<td>
												{order.totalPrice.toLocaleString("en-IN", {
													maximumFractionDigits: 0,
													style: "currency",
													currency: "INR"
												})}
											</td>
											<td>
												{order.isPaid ? (
													<i
														className="fa fa-check"
														style={{
															color: "green"
														}}
													/>
												) : (
													<i
														className="fas fa-times"
														style={{
															color: "red"
														}}
													/>
												)}
											</td>
											<td>
												{order.isDelivered ? (
													getDateString(order.deliveredAt)
												) : (
													<i
														className="fas fa-times"
														style={{
															color: "red"
														}}
													/>
												)}
											</td>
											<td>
												<LinkContainer to={`/order/${order._id}`}>
													<Button
														variant="link"
														className="btn-sm"
														style={{ margin: "0" }}
													>
														Details
													</Button>
												</LinkContainer>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						)}
					</>
				) : (
					<Card style={{ border: "none", margin: "0 auto" }}>
						<Card.Body>
							<Card.Title>No Orders Yet!</Card.Title>
							<Card.Text>
								Details about all your orders will show up here.{" "}
								<Link to="/">Continue Shopping</Link>
							</Card.Text>
						</Card.Body>
					</Card>
				)}
			</Col>
		</Row>
	);
};

export default ProfilePage;
