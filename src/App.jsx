import { appWindow } from "@tauri-apps/api/window";
import React, { useRef, useEffect, useState } from "react";
import {
	MantineProvider,
	AppShell,
	Flex,
	Group,
	Box,
	Navbar,
	UnstyledButton,
	Header,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import {
	GetJson,
	SaveFileJSON,
	AddNewEntryJSON,
	GetSettings,
} from "./utils/DataManager";

import CopyCatWindowTitle from "./assets/WindowTitle";
import WindowControls from "./components/WindowControls";

import Editor from "./components/Editor";
import Scratchpad from "./components/Scratchpad";
import ListView from "./components/ListView";
import SearchBar from "./components/SearchBar";
import SearchView from "./components/SearchListView";
import AddMacroButton from "./components/AddMacroButton";

import { ShowModalDiscardChanges } from "./components/Modals";

const App = () => {
	const [jsonData, setJsonData] = useState(null);
	const [page, setPage] = useState({ id: -1 });
	const [scratchpadText, setScratchpadText] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState(null);
	const [settings, setSettings] = useState(null);

	const editorRef = useRef(null);

	const loadPage = (item, forceLock) => {
		if (forceLock === undefined) {
			if (editorRef?.current?.CheckForUnsavedChanges(page)) {
				ShowModalDiscardChanges(
					item.name,
					() => {
						setTimeout(() => editorRef?.current?.ToggleLock(true), 100);
						setPage(item);
					},
					() => {}
				);
			} else {
				if (!editorRef?.current?.IsLocked()) {
					editorRef?.current?.ToggleLock(true);
				}
				setPage(item);
			}
		} else {
			setTimeout(() => editorRef?.current?.ToggleLock(forceLock), 100);
			setPage(item);
		}
	};

	function makeUnique(obj) {
		let name = obj.name;
		let command = obj.command;
		let nameCount = 0;
		let commandCount = 0;
		let existingNames = [];
		let existingCommands = [];

		// create array of existing names and commands in array
		jsonData.forEach((existingObj) => {
			if (existingObj.name !== "") {
				existingNames.push(existingObj.name);
			}
			if (existingObj.command !== "") {
				console.log("Non empty command");
				existingCommands.push(existingObj.command);
			}
		});

		// check for existing name or command in array
		while (existingNames.includes(name)) {
			nameCount++;
			name = `${obj.name} (${nameCount})`;
		}

		while (existingCommands.includes(command)) {
			commandCount++;
			command = obj.command !== "" ? `${obj.command}-${commandCount}` : "";
		}

		// return modified object
		return { ...obj, name: name, command: command };
	}

	const updateJsonEntry = async (updated, isRemoving = false) => {
		const updateIndex = jsonData.findIndex((data) => data.id === updated.id);
		const updatedData = [...jsonData];

		if (updateIndex !== -1) {
			if (!isRemoving) {
				updatedData[updateIndex] = updated;
			} else {
				updatedData.splice(updateIndex, 1);
			}
			loadPage(updatedData[updateIndex], true);
		} else {
			const unique = makeUnique(updated);
			updatedData.unshift(
				AddNewEntryJSON(unique.name, unique.text, unique.command)
			);
		}

		if (jsonData.length < updatedData.length) {
			loadPage(updatedData[0], false);
		}

		setJsonData(updatedData);
		await SaveFileJSON(updatedData);
	};

	const updateJsonArray = async (updatedArray) => {
		setJsonData(updatedArray);
		await SaveFileJSON(updatedArray);
	};

	/* HOOKS ==================================================================== */

	useEffect(() => {
		const getSettingsFromFile = async () => {
			return await GetSettings();
		};

		if (!settings) {
			getSettingsFromFile().then((data) => {
				const parsedData = JSON.parse(data);
				setSettings(parsedData);
				appWindow.setSize(parsedData.resolution);
				appWindow.setPosition(parsedData.position);
			});
		}
	}, [settings]);

	useEffect(() => {
		const getJsonDataFromJsonFile = async () => {
			return await GetJson();
		};

		if (!jsonData)
			getJsonDataFromJsonFile().then((data) => {
				setJsonData(data);
			});
	}, [jsonData]);

	return (
		<MantineProvider withCSSVariables withNormalizeCSS>
			<NotificationsProvider position="top-center">
				<ModalsProvider>
					<AppShell
						header={
							<Header
								height={30}
								withBorder={false}
								sx={(theme) => ({
									backgroundColor: theme.colors.blue[8],
								})}>
								<Group style={{ height: "100%" }} grow>
									<Flex
										data-tauri-drag-region
										gap={10}
										pl={10}
										align="center"
										style={{ height: "100%", userSelect: "none" }}>
										<Box
											style={{
												height: 18,
												width: 75,
												pointerEvents: "none",
												userSelect: "none",
											}}
											mt={0}>
											<CopyCatWindowTitle />
										</Box>
									</Flex>
									<WindowControls
										page={page}
										editorRef={editorRef}
										updateJsonArray={updateJsonArray}
									/>
								</Group>
							</Header>
						}
						navbar={
							<div style={{ height: "100%" }}>
								<Navbar
									width={{ base: 250 }}
									height={"100%"}
									sx={(theme) => ({
										border: 0,
										display: "flex",
										flexDirection: "column",
										backgroundColor: theme.colors.gray[0],
										borderRight: "1px solid " + theme.colors.gray[3],
									})}>
									<UnstyledButton
										onClick={() => {
											loadPage({ id: -1 });
										}}
										py={20}
										sx={(theme) => ({
											justifyContent: "center",
											color: "white",
											backgroundColor: theme.colors.blue[6],
											fontWeight: "400",
											fontSize: 13,

											"&:hover": {
												color: "white",
												backgroundColor: theme.colors.blue[7],
											},
											"&:active": {
												paddingTop: 22,
												paddingBottom: 18,
												backgroundColor: theme.colors.blue[6],
											},
										})}>
										<Group position="center">Open Scratchpad</Group>
									</UnstyledButton>
									<SearchBar
										searchQuery={searchQuery}
										setSearchQuery={setSearchQuery}
										count={searchResults?.length}
									/>
									{searchQuery == "" ? (
										<ListView
											page={page}
											jsonData={jsonData}
											loadPage={loadPage}
											updateJsonListPositions={updateJsonArray}
										/>
									) : (
										<SearchView
											page={page}
											loadPage={loadPage}
											searchQuery={searchQuery}
											searchResults={searchResults}
											setSearchResults={setSearchResults}
											jsonData={jsonData}
										/>
									)}
									<Box style={{ flex: "0 0 90px" }}>
										<AddMacroButton
											updateJsonEntry={updateJsonEntry}
											page={page}
											editorRef={editorRef}
										/>
									</Box>
								</Navbar>
							</div>
						}
						styles={(theme) => ({
							main: {
								backgroundColor:
									theme.colorScheme === "dark"
										? theme.colors.dark[8]
										: theme.colors.gray[0],
							},
						})}>
						{page && page.id !== -1 ? (
							<Editor
								page={page}
								updateJsonEntry={updateJsonEntry}
								ref={editorRef}
							/>
						) : (
							<Scratchpad
								jsonData={jsonData}
								updateJsonEntry={updateJsonEntry}
								scratchpadText={scratchpadText}
								setScratchpadText={setScratchpadText}
							/>
						)}
					</AppShell>
				</ModalsProvider>
			</NotificationsProvider>
		</MantineProvider>
	);
};

export default App;
