import { ScrollArea } from "@mantine/core";
import React, { useState, useEffect } from "react";
import ListItem from "./ListItem";

const getSearchTags = (jsonData) => {
	const tags = jsonData.reduce((acc, obj) => {
		Object.keys(obj).forEach((key) => {
			if (!acc.includes(key)) {
				acc.push(key);
			}
		});
		return acc;
	}, []);

	return tags;
};

const SearchView = ({
	page,
	searchQuery,
	searchResults,
	setSearchResults,
	jsonData,
	loadPage,
}) => {
	const [searchTags, setSearchTags] = useState(getSearchTags(jsonData));

	useEffect(() => {
		setSearchTags(getSearchTags(jsonData));
	}, [jsonData]);

	useEffect(() => {
		const searchingByTag = searchTags.find((property) => {
			const pattern = new RegExp(`^${property}: *`);
			return pattern.test(searchQuery);
		});

		if (searchingByTag) {
			// Strip the tag off the search:
			const indexOfColon = searchQuery.indexOf(":");
			const searchTerm = searchQuery.substring(indexOfColon + 1).trim();

			const results = jsonData.filter((item) =>
				item[searchingByTag].includes(searchTerm)
			);

			setSearchResults(results);
		} else {
			// General search
			const results = jsonData.filter((item) => {
				return Object.values(item).some((value) => {
					return (
						typeof value === "string" &&
						value.toLowerCase().includes(searchQuery.trim().toLowerCase())
					);
				});
			});

			setSearchResults(results);
		}
	}, [searchQuery]);

	if (searchResults)
		return (
			<ScrollArea
				scrollbarSize={4}
				sx={(theme) => ({
					backgroundColor: theme.colors.gray[2],
					width: "100%",
					height: "100%",
				})}>
				{searchResults.map((item, index) => {
					return (
						<ListItem
							key={index}
							item={item}
							id={item.id}
							page={page}
							searchQuery={searchQuery}
							onClick={() => {
								loadPage(item);
							}}
						/>
					);
				})}
			</ScrollArea>
		);
};

export default SearchView;
