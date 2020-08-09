import React from "react";

const ThemeContext = React.createContext();
const { Consumer, Provider } = ThemeContext;

export {
	Consumer as ThemeConsumer,
	Provider as ThemeProvider,
	ThemeContext as default,
};
