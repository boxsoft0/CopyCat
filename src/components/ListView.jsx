import React, { useRef, useState } from "react";
import { Loader, ScrollArea, Stack } from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ListItem from "./ListItem";

const ListView = ({ page, jsonData, loadPage, updateJsonListPositions }) => {
	const refs = useRef([]);

	async function handleOnDragEnd(result) {
		if (!result.destination) return;

		const links = Array.from(jsonData);
		const [reorderedItem] = links.splice(result.source.index, 1);
		links.splice(result.destination.index, 0, reorderedItem);

		updateJsonListPositions(links);
	}

	if (jsonData) {
		return (
			<ScrollArea
				scrollbarSize={4}
				sx={(theme) => ({
					display: "flex",
					flexDirection: "column",
					height: "100%",
					backgroundColor: theme.colors.gray[0],
				})}
				styles={(theme) => ({
					scrollbar: {
						"&, &:hover": {
							background: "rgba(0,0,0,0)",
						},

						'&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
							backgroundColor: theme.colors.gray[4],
						},
					},
				})}>
				<DragDropContext onDragEnd={handleOnDragEnd}>
					<Droppable droppableId="navbarList">
						{(provided) => (
							<div
								className="dropItems"
								{...provided.droppableProps}
								ref={provided.innerRef}>
								{jsonData.map((item, index) => {
									return (
										<Draggable
											id={item.id}
											key={item.id}
											draggableId={item.id}
											index={index}>
											{(provided) => (
												<>
													<div
														id={item.id}
														ref={provided.innerRef}
														{...provided.draggableProps}>
														<ListItem
															item={item}
															id={item.id}
															page={page}
															ref={(el) => (refs.current[index] = el)}
															dragHandleProps={provided.dragHandleProps}
															onClick={() => {
																loadPage(item);
															}}
														/>
													</div>
												</>
											)}
										</Draggable>
									);
								})}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</ScrollArea>
		);
	} else {
		return (
			<Stack align="center" justify="center" style={{ height: "100%" }}>
				<Loader />
			</Stack>
		);
	}
};

export default ListView;
