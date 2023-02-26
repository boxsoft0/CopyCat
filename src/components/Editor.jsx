import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Group,
	Stack,
	Textarea,
	TextInput,
	Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import {
	IconCopy,
	IconDownload,
	IconEdit,
	IconScissors,
	IconTrash,
} from "@tabler/icons-react";
import { AddNewEntryJSON } from "../utils/DataManager";
import { ShowModalDeleteMacro, ShowModalDiscardChanges } from "./Modals";
import { copiedToClipboard, snippedMacro } from "./Notifications";

const Editor = forwardRef(({ page, updateJsonEntry }, ref) => {
	const [isLocked, setIsLocked] = useState(true);

	const refInputName = useRef(null);
	const refInputText = useRef(null);
	const refInputCommand = useRef(null);
	const refButtonSnippet = useRef(null);

	/* HOOKS ==================================================================== */

	useEffect(() => {
		SetFormValues(page);
	});

	useEffect(() => {
		function handleSelectionChange() {
			const selection = window.getSelection().toString();
			const showButton = !!selection;

			if (refButtonSnippet.current) {
				refButtonSnippet.current.style.display = showButton ? "block" : "none";
			}
		}

		document.addEventListener("selectionchange", handleSelectionChange);
		return () =>
			document.removeEventListener("selectionchange", handleSelectionChange);
	}, []);

	useEffect(() => {
		SetFormValues(page);

		if (!isLocked) {
			refInputName.current.select();
		}
	}, [page, isLocked]);

	useEffect(() => {
		function handleKeyDown(e) {
			if (isLocked && e.key === "c" && e.ctrlKey) {
				CopyTextField();
			} else if (isLocked && e.key == "m" && e.ctrlKey) {
				const selection = window.getSelection().toString();
				CreateSnippetFromSelection(selection);
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	useImperativeHandle(ref, () => ({
		CheckForUnsavedChanges: (currentPage) => {
			return EditorHasUnsavedChanges(GetFormValues(), currentPage);
		},
		GetFormValues: () => {
			return GetFormValues();
		},
		IsLocked: () => {
			return isLocked;
		},
		ToggleLock: (toggle) => {
			ToggleLock(toggle);
		},
	}));

	/* FUNCTIONS ================================================================ */

	function SetFormValues(values) {
		if (refInputName.current) refInputName.current.value = values.name;
		if (refInputText.current) refInputText.current.value = values.text;
		if (refInputCommand.current) refInputCommand.current.value = values.command;
	}

	function GetFormValues() {
		return {
			name: refInputName?.current?.value,
			text: refInputText?.current?.value,
			command: refInputCommand?.current?.value,
		};
	}

	function ToggleLock(toggle) {
		setIsLocked(toggle);
	}

	function EditorHasUnsavedChanges(valuesFromFields, page) {
		const valuesFromSave = {
			name: page.name,
			text: page.text,
			command: page.command,
		};

		const compareFields = JSON.stringify(valuesFromFields);
		const compareSaved = JSON.stringify(valuesFromSave);

		if (!isLocked && compareFields !== compareSaved) return true;
		return false;
	}

	function CopyTextField() {
		const selection = window.getSelection().toString();
		console.log(selection);

		if (selection.length === 0) {
			if (refInputText.current) {
				navigator.clipboard.writeText(refInputText.current.value);
				showNotification(copiedToClipboard);
			}
		}
	}

	function CreateSnippetFromSelection(selection) {
		if (selection.length > 0) {
			updateJsonEntry(
				AddNewEntryJSON(
					refInputName?.current?.value,
					selection,
					refInputCommand?.current?.value
				)
			);
			showNotification(snippedMacro);
		}
	}

	/* COMPONENTS =============================================================== */

	const InputName = forwardRef(({}, ref) => {
		return (
			<TextInput
				name="name"
				description="Name"
				ref={ref}
				disabled={isLocked}
				tabIndex={1}
				sx={(theme) => ({
					input: {
						"&:disabled": {
							border: "1px solid #f3f5f6",
							opacity: 0.75,

							color: "black",
							cursor: "default",
						},
					},
				})}
			/>
		);
	});

	const InputText = forwardRef(({}, ref) => {
		return (
			<Textarea
				name="text"
				description="Text"
				ref={ref}
				disabled={isLocked}
				tabIndex={2}
				style={{ height: "90%" }}
				styles={{
					wrapper: { height: `calc(100% - 19px)`, display: "flex" },
					input: {
						flex: 1,
						height: "100%",
						"&:disabled": {
							border: "1px solid #f3f5f6",
							opacity: 0.75,
							color: "black",
							cursor: "default",
						},
					},
				}}
			/>
		);
	});

	const InputCommand = forwardRef(({}, ref) => {
		return (
			<TextInput
				name="command"
				description="Command"
				ref={ref}
				disabled={isLocked}
				tabIndex={3}
				sx={(theme) => ({
					input: {
						"&:disabled": {
							border: "1px solid #f3f5f6",
							opacity: 0.75,
							color: "black",
							cursor: "default",
						},
					},
				})}
			/>
		);
	});

	const ButtonEdit = () => {
		return (
			<ActionIcon
				variant={isLocked ? "subtle" : "fill"}
				color="blue"
				size={18}
				onClick={() => {
					if (EditorHasUnsavedChanges(GetFormValues(), page)) {
						ShowModalDiscardChanges(
							GetFormValues().name,
							() => {
								ToggleLock(true);
							},
							null
						);
					} else {
						ToggleLock(!isLocked);
					}
				}}>
				<IconEdit size={16} />
			</ActionIcon>
		);
	};

	const ButtonDelete = () => {
		return (
			<ActionIcon
				variant="subtle"
				color="red"
				size={18}
				onClick={async () => {
					ShowModalDeleteMacro(GetFormValues().name, () => {
						updateJsonEntry({ id: page.id }, true);
					});
				}}>
				<IconTrash size={16} />
			</ActionIcon>
		);
	};

	const ButtonSaveChanges = () => {
		return (
			<Button
				leftIcon={<IconDownload size={16} />}
				tabIndex={4}
				onClick={() => {
					const formValues = GetFormValues();
					if (formValues.command.startsWith("/"))
						formValues.command = formValues.command.slice(1);
					updateJsonEntry({ ...formValues, id: page.id });
					SetFormValues(formValues);
				}}>
				Save changes
			</Button>
		);
	};

	const ButtonDiscardChanges = () => {
		return (
			<Button
				variant="subtle"
				tabIndex={5}
				onClick={() => {
					SetFormValues(page);
					ToggleLock(true);
				}}>
				Discard changes
			</Button>
		);
	};

	const ButtonCopyToClipboard = () => {
		return (
			<Button
				leftIcon={<IconCopy size={16} />}
				onClick={() => {
					CopyTextField();
				}}>
				Copy text to clipboard
			</Button>
		);
	};

	const ButtonCreateSnippetFromSelection = () => {
		return (
			<Button
				ref={refButtonSnippet}
				leftIcon={<IconScissors size={16} />}
				sx={(theme) => ({
					display: "none",
				})}
				onClick={() => {
					CreateSnippetFromSelection(window.getSelection().toString());
				}}>
				Create snippet from selection
			</Button>
		);
	};

	return (
		<Box ref={ref} style={{ height: "100%" }}>
			<Stack spacing={10} justify="flex-start" style={{ height: "100%" }}>
				<Group grow>
					<Title order={5}>
						{isLocked ? "Macro details" : `Editing macro`}
					</Title>
					<Group position="right">
						<ButtonEdit />
						<ButtonDelete />
					</Group>
				</Group>
				<Divider />
				<InputName ref={refInputName} />
				<InputText ref={refInputText} />
				<InputCommand ref={refInputCommand} />
				<Group mt={16} position="right">
					{!isLocked ? (
						<>
							<ButtonDiscardChanges />
							<ButtonSaveChanges />
						</>
					) : (
						<>
							<ButtonCreateSnippetFromSelection />
							<ButtonCopyToClipboard />
						</>
					)}
				</Group>
			</Stack>
		</Box>
	);
});

export default Editor;
