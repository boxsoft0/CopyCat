import React from "react";
import { Box, Text } from "@mantine/core";
import { MarkSearchQuery } from "../utils/HighlightSearchQuery";

export const CommandLabel = ({ label, searchQuery }) => {
	return (
		<Box
			py={2}
			px={4}
			sx={(theme) => ({
				backgroundColor: theme.colors.blue[1],
			})}>
			<Text
				sx={(theme) => ({
					fontFamily: "monospace",
					fontWeight: 700,
					fontSize: 10,
				})}>
				/
				{label.length <= 16
					? MarkSearchQuery(label, searchQuery)
					: MarkSearchQuery(label.substring(0, 16), searchQuery) + "..."}
			</Text>
		</Box>
	);
};
