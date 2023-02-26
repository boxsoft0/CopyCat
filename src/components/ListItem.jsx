import {
	Box,
	Col,
	Grid,
	Text,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import React, { forwardRef, useEffect, useState } from "react";
import { MarkSearchQuery } from "../utils/HighlightSearchQuery";
import { CommandLabel } from "./CommandLabel";

const ListItem = forwardRef(
	({ item, id, page, onClick, dragHandleProps, searchQuery }, ref) => {
		const [isActive, setIsActive] = useState(false);

		const theme = useMantineTheme();

		useEffect(() => {
			if (page && page.id === id) {
				setIsActive(true);
			} else {
				setIsActive(false);
			}
		});

		return (
			<Grid
				gutter={0}
				align="stretch"
				sx={(theme) => ({
					width: 246,
					maxWidth: 246,
					backgroundColor: theme.colors.gray[0],
					borderBottom: "1px solid " + theme.colors.gray[3],
					borderLeft: isActive
						? "3px solid " + theme.colors.blue[6]
						: "3px solid rgba(0,0,0,0)",
					"&:hover": {
						backgroundColor: theme.colors.gray[1],
					},
				})}>
				<Col span="content">
					{dragHandleProps && (
						<Box
							{...dragHandleProps}
							pl={6}
							style={{
								display: "flex",
								alignItems: "center",
								height: "100%",
							}}>
							<IconGripVertical size={14} color={theme.colors.gray[4]} />
						</Box>
					)}
				</Col>
				<Col span="auto">
					<UnstyledButton
						onClick={onClick}
						pr={6}
						pl={dragHandleProps ? 6 : 10}
						py={4}
						sx={(theme) => ({
							width: "100%",
							maxWidth: 220,
							fontSize: theme.fontSizes.xs,
							"&:active": {
								paddingTop: 5,
								paddingBottom: 3,
							},
						})}>
						<Grid gutter={0} style={{ alignItems: "center", width: "100%" }}>
							<Col span="auto">
								<Text lineClamp={1} fw={700}>
									{MarkSearchQuery(item.name, searchQuery)}
								</Text>
							</Col>
							<Col span="content">
								{item.command && (
									<CommandLabel
										label={item.command}
										searchQuery={searchQuery}
									/>
								)}
							</Col>
						</Grid>
						<Text lineClamp={1}>{MarkSearchQuery(item.text, searchQuery)}</Text>
					</UnstyledButton>
				</Col>
			</Grid>
		);
	}
);

export default ListItem;
