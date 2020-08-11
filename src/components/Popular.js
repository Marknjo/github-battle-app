import React, { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { fetchPopularRepos } from "../utils/api";
import {
	FaUser,
	FaStar,
	FaCodeBranch,
	FaExclamationTriangle,
} from "react-icons/fa";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";

const LangaugesNav = ({ selected, onUpdateLanguage }) => {
	const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

	return (
		<ul className="flex-center">
			{languages.map((language) => (
				<li key={language}>
					<button
						className="btn-clear nav-link"
						style={language === selected ? { color: "rgb(187, 46, 31)" } : null}
						onClick={() => onUpdateLanguage(language)}
					>
						{language}
					</button>
				</li>
			))}
		</ul>
	);
};

LangaugesNav.propTypes = {
	selected: PropTypes.string.isRequired,
	onUpdateLanguage: PropTypes.func.isRequired,
};

const ReposGrid = ({ repos }) => (
	<ul className="grid space-around">
		{repos.map((repo, index) => {
			const { owner, html_url, stargazers_count, forks, open_issues } = repo;
			const { login, avatar_url } = owner;

			return (
				<li key={html_url}>
					<Card
						header={`#${index + 1}`}
						avatar={avatar_url}
						href={html_url}
						name={login}
					>
						<ul className="card-list">
							<li>
								<Tooltip text="Github username">
									<FaUser color="rgb(255, 191, 116)" size={22} />
									<a href={`https://github.com/${login}`}>{login}</a>
								</Tooltip>
							</li>
							<li>
								<FaStar color="rgb(255, 215, 0)" size={22} />
								{stargazers_count.toLocaleString()} stars
							</li>
							<li>
								<FaCodeBranch color="rgb(129, 195, 245)" size={22} />
								{forks.toLocaleString()} forks
							</li>
							<li>
								<FaExclamationTriangle color="rgb(241, 138, 147)" size={22} />
								{open_issues.toLocaleString()} open
							</li>
						</ul>
					</Card>
				</li>
			);
		})}
	</ul>
);

ReposGrid.propTypes = {
	repos: PropTypes.array.isRequired,
};

const popularReducer = (state, action) => {
	switch (action.type) {
		case "FETCHED_REPOS_SUCCESS":
			return {
				...state,
				repos: action.payload.repos,
			};

		case "FETCHED_REPOS_ERROR":
			return {
				...state,
				error: action.payload.error,
			};

		case "FECHING_REPO_LANGUAGE":
			return {
				...state,
				error: null,
				selectedLanguage: action.payload.selectedLanguage,
			};

		default:
			throw new Error("System cannot recognize the action type");
	}
};

const popularComponentInitialState = {
	selectedLanguage: "all",
	repos: {},
	error: null,
};

const Popular = () => {
	const [state, dispatch] = useReducer(
		popularReducer,
		popularComponentInitialState
	);

	const { selectedLanguage, repos, error } = state;

	const updateLanguage = (s_language) => {
		dispatch({
			type: "FECHING_REPO_LANGUAGE",
			payload: {
				selectedLanguage: s_language,
			},
		});
	};

	useEffect(() => {
		let isCurrent = true;
		if (!repos[selectedLanguage]) {
			fetchPopularRepos(selectedLanguage)
				.then((data) => {
					if (isCurrent) {
						dispatch({
							type: "FETCHED_REPOS_SUCCESS",
							payload: {
								repos: { [selectedLanguage]: data },
							},
						});
					}
				})
				.catch((error) => {
					console.warn("Error fetching repos: ", error);

					dispatch({
						type: "FETCHED_REPOS_ERROR",
						payload: {
							error: `There was an error fetching the repositories.`,
						},
					});
				});
		}

		return () => {
			isCurrent = false;
		};
	}, [selectedLanguage, repos]);

	const isLoading = () => {
		return !repos[selectedLanguage] && error === null;
	};

	return (
		<>
			<LangaugesNav
				selected={selectedLanguage}
				onUpdateLanguage={updateLanguage}
			/>

			{isLoading() && <Loading text="Fetching Repos" />}

			{error && <p className="center-text error">{error}</p>}

			{repos[selectedLanguage] && <ReposGrid repos={repos[selectedLanguage]} />}
		</>
	);
};

export default Popular;
