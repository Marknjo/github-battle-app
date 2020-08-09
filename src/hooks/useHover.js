import { useState } from "react";

const useHover = () => {
	const [hovering, useHovering] = useState(false);

	const mouseOver = () => useHovering(true);
	const mouseOut = () => useHovering(false);

	return [
		hovering,
		{
			onMouseOver: mouseOver,
			onMouseOut: mouseOut,
		},
	];
};

export default useHover;
