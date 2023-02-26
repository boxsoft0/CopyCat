import React from "react";
import { Text, Input, Group, ActionIcon, Box } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

const SearchBar = ({ searchQuery, setSearchQuery, count }) => {
	const handleFormChange = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<Box
			p={0}
			sx={(theme) => ({
				flex: "0 1 auto",
				background: theme.colors.gray[0],
				borderBottom: "1px solid " + theme.colors.gray[3],
			})}>
			<Input
				my={8}
				mx={8}
				icon={<IconSearch size={16} />}
				rightSection={
					searchQuery && (
						<ActionIcon
							style={{ opacity: 0.5 }}
							size={16}
							radius="lg"
							variant="filled"
							onClick={() => setSearchQuery("")}>
							<IconX size={12} />
						</ActionIcon>
					)
				}
				placeholder="Search (title, text, etc...)"
				value={searchQuery}
				onChange={(e) => handleFormChange(e)}
			/>
			<Group
				spacing="xs"
				position="center"
				mb={8}
				display={searchQuery ? "flex" : "none"}>
				<Text size="xs">
					Showing <b>{count}</b> results...
				</Text>
			</Group>
		</Box>
	);
};

export default SearchBar;
