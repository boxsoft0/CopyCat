import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import {
	Box,
	Group,
	ScrollArea,
	Stack,
	Text,
	Title,
	UnstyledButton,
} from "@mantine/core";
import { IconAlertCircleFilled, IconCode } from "@tabler/icons-react";
import { CommandLabel } from "./CommandLabel";

export const CommandList = forwardRef(
	({ jsonData, editor, InsertSelectedCommandText }, ref) => {
		const [isOpen, setIsOpen] = useState(false);
		const [searchQuery, setSearchQuery] = useState("");
		const [selectedCommand, setSelectedCommand] = useState(-1);
		const [foundCommands, setFoundCommands] = useState(-1);

		const scrollbarRef = useRef(null);
		const commandListRef = useRef([]);

		useEffect(() => {
			if (jsonData && commandListRef.current) {
				const listOfCommands = FilteredCommandList(jsonData, searchQuery);
				function handleKeyDown(event) {
					let direction = 0;
					if (isOpen) {
						if (event.key === "ArrowUp") {
							direction -= 1;
							event.preventDefault();
						} else if (event.key === "ArrowDown") {
							direction += 1;
							event.preventDefault();
						}

						const selection = selectedCommand + direction;
						if (selection < 0 || selection > listOfCommands.length - 1) {
							console.log("Out of bounds");
							return;
						} else {
							console.log("Selected: " + selection);
							if (listOfCommands && listOfCommands.length > 0) {
								commandListRef.current[selection].scrollToItem(
									selection,
									"auto"
								);
								setSelectedCommand(selection);
							}
						}
					}
				}

				window.addEventListener("keydown", handleKeyDown);
				return () => {
					window.removeEventListener("keydown", handleKeyDown);
				};
			}
		});

		useImperativeHandle(ref, () => ({
			showControlList: (typedCommand) => {
				if (typedCommand && typedCommand.length > 0) {
					const commands = FilteredCommandList(
						jsonData,
						typedCommand.substring(1)
					);

					setSearchQuery(typedCommand.substring(1));
					setSelectedCommand(0);
					setFoundCommands(commands);
					setIsOpen(true);
				} else {
					setSearchQuery("");
					setIsOpen(false);
				}
			},
			getOpenState: () => {
				return isOpen;
			},
			selectCommand: () => {
				scrollbarRef.current.scrollTo({ top: 0 });
				const command = FilteredCommandList(jsonData, searchQuery)[
					selectedCommand
				];
				return command;
			},
		}));

		const onClickCommand = (commandName) => {
			scrollbarRef.current.scrollTo({ top: 0 });
			console.log("I'm looking for " + commandName + " in: ");
			console.log(jsonData);
			if (jsonData) {
				const command = jsonData.find((item) => item.command === commandName);
				console.log("I'm sending command " + JSON.stringify(command));
				InsertSelectedCommandText(command, editor);
				editor.commands.focus();
			}
		};

		if (jsonData)
			return (
				<Box
					sx={(theme) => ({
						display: "flex",
						flexDirection: "column",
						borderRadius: theme.spacing.xs,
						backgroundColor: theme.colors.gray[2],
						display: isOpen ? "block" : "none",
						padding: theme.spacing.xs,
						zIndex: 10,
						boxShadow: "0px 2px 4px 0px rgba(0,0,0,0.25)",
					})}>
					<Group spacing={0} mb={8}>
						<IconCode size={18} />
						<Title order={5} ml={4}>
							Commands
						</Title>
						<Text
							mx={4}
							sx={(theme) => ({
								fontSize: theme.fontSizes.sm,
							})}>
							matching
						</Text>
						<CommandLabel label={searchQuery} />
					</Group>
					<ScrollArea.Autosize
						viewportRef={scrollbarRef}
						sx={(theme) => ({
							flex: 1,
							maxHeight: window.innerHeight / 3,
							borderRadius: theme.radius.sm,
							backgroundColor: theme.colors.gray[5],
						})}>
						<Stack spacing={2} m={4}>
							{foundCommands && foundCommands.length > 0 ? (
								FilteredCommandList(jsonData, searchQuery).map((item, i) => {
									return (
										<CommandListItem
											key={i}
											name={item.name}
											text={item.text}
											command={item.command}
											index={i}
											ref={(el) => (commandListRef.current[i] = el)}
											selectedCommand={selectedCommand}
											setSelectedCommand={setSelectedCommand}
											onClickCommand={onClickCommand}
										/>
									);
								})
							) : (
								<Box
									sx={(theme) => ({
										color: "white",
										backgroundColor: theme.colors.red[8],
										padding: theme.spacing.sm,
									})}>
									<Group style={{}}>
										<IconAlertCircleFilled />
										<Text lineClamp={1}>
											No results for /
											{searchQuery.length <= 16
												? searchQuery
												: searchQuery.substring(0, 16) + "..."}
										</Text>
									</Group>
								</Box>
							)}
						</Stack>
					</ScrollArea.Autosize>
				</Box>
			);
	}
);

const CommandListItem = forwardRef(
	(
		{
			name,
			text,
			command,
			index,
			selectedCommand,
			setSelectedCommand,
			onClickCommand,
		},
		ref
	) => {
		const imperativeRef = useRef(null);

		useImperativeHandle(ref, () => ({
			scrollToItem: (selectedCommand, smooth = true) => {
				setTimeout(() => {
					imperativeRef.current.scrollIntoView({
						behavior: smooth ? "smooth" : "instant",
						block: "center",
					});
				}, 50);
			},
		}));

		return (
			<UnstyledButton
				key={index}
				ref={imperativeRef}
				onClick={() => {
					onClickCommand(command);
				}}
				onMouseEnter={() => {
					setSelectedCommand(index);
				}}
				sx={(theme) => ({
					backgroundColor: theme.colors.gray[0],
					borderRadius: theme.radius.sm,
					padding: theme.spacing.xs,
					border:
						selectedCommand === index
							? "3px solid " + theme.colors.blue[5]
							: "3px solid rgba(0,0,0,0)",
				})}>
				<Group spacing={8}>
					<CommandLabel label={command} />
					<Title order={6}>{name}</Title>
				</Group>
				<Text size={12}>{text}</Text>
			</UnstyledButton>
		);
	}
);

export const FilteredCommandList = (jsonData, query) => {
	const commands = jsonData.filter((item) => {
		return item.command && item.command.length > 0;
	});

	if (query <= 0) return commands;

	return commands.filter((item) => {
		return item.command.toLowerCase().includes(query.toLowerCase());
	});
};
