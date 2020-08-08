import React, { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./contexts/theme";
import Nav from "./components/Nav";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "./components/Loading";

const Popular = React.lazy(() => import("./components/Popular"));
const Battle = React.lazy(() => import("./components/Battle"));
const Results = React.lazy(() => import("./components/Results"));

const App = () => {
	const defaultState = {
		theme: "light",
		toggleTheme: () => {
			setTheme(({ theme }) => ({
				theme: theme === "light" ? "dark" : "light",
			}));
		},
	};
	const [state, setTheme] = useState(defaultState);

	return (
		<Router>
			<ThemeProvider value={state}>
				<div className={state.theme}>
					<div className="container">
						<Nav />

						<React.Suspense fallback={<Loading />}>
							<Switch>
								<Route exact path="/" component={Popular} />
								<Route exact path="/battle" component={Battle} />
								<Route path="/battle/results" component={Results} />
								<Route render={() => <h1>404</h1>} />
							</Switch>
						</React.Suspense>
					</div>
				</div>
			</ThemeProvider>
		</Router>
	);
};

export default App;
