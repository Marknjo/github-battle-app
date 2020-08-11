import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const styles = {
	content: {
		fontSize: "35px",
		position: "absolute",
		left: "0",
		right: "0",
		marginTop: "20px",
		textAlign: "center",
	},
};

const Loading = ({ text = "Loading", speed = 300 }) => {
	const [content, setContent] = useState(text);

	useEffect(() => {
		const intervalTimer = window.setInterval(() => {
			setContent((content) => {
				return content === `${text}...` ? text : `${content}.`;
			});
		}, speed);

		return () => window.clearInterval(intervalTimer);
	}, [speed, text]);

	return <p style={styles.content}>{content}</p>;
};

Loading.propTypes = {
	text: PropTypes.string.isRequired,
	speed: PropTypes.number.isRequired,
};

export default Loading;
