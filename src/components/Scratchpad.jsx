import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Col,
	Divider,
	Grid,
	Group,
	Text,
	Title,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";

import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import HardBreak from "@tiptap/extension-hard-break";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import { Text as TiptapText } from "@tiptap/extension-text";
import History from "@tiptap/extension-history";

import { GetBraces, SelectBraces } from "../utils/Braces";
import { CommandList } from "./CommandList";

import { showNotification } from "@mantine/notifications";
import { copiedToClipboard } from "./Notifications";
import { ShowModalUnresolvedBraces } from "./Modals";

import { IconBracesOff, IconCopy, IconDownload } from "@tabler/icons-react";
import { AddNewEntryJSON } from "../utils/DataManager";

import "../styles/tiptapstyle.css";

const Scratchpad = ({
	jsonData,
	updateJsonEntry,
	scratchpadText,
	setScratchpadText,
}) => {
	const [focused, setFocused] = useState(null);
	const [unresolvedBraces, setUnresolvedBraces] = useState(0);

	const editorRef = useRef(null);
	const refCommandList = useRef(null);

	const theme = useMantineTheme();

	const OverrideEnter = HardBreak.extend({
		addKeyboardShortcuts() {
			return {
				Enter: () => {
					HandleEnter(this.editor, refCommandList);
					return true;
				},
			};
		},
	});

	const editor = useEditor({
		extensions: [
			Document,
			Paragraph,
			TiptapText,
			OverrideEnter,
			History.configure({
				depth: 100,
			}),
			Placeholder.configure({
				placeholder:
					"Type here... Use /commands to quickly insert assigned macros.",
			}),
		],
		content: "",
		onFocus() {
			setFocused(true);
		},
		onBlur() {
			setFocused(false);
		},
		onUpdate() {
			// Store the text so it can be recalled
			// when switch to/from Scratchpad
			setScratchpadText(this.getText());

			const braces = GetBraces(this.getText());
			setUnresolvedBraces(braces ? braces.length : 0);
		},
		onTransaction() {
			if (refCommandList.current) {
				const typedCommand = CommandIsBeingTyped(
					this.getText(),
					this.state.selection.$anchor.pos
				);

				if (typedCommand) {
					refCommandList.current.showControlList(typedCommand);
				} else {
					refCommandList.current.showControlList();
				}
			}
		},
	});

	function HandleEnter(editor) {
		const commandListOpen =
			refCommandList.current && refCommandList.current.getOpenState();

		if (!commandListOpen) {
			editor.commands.setHardBreak();
		} else {
			const selectedCommand = refCommandList.current.selectCommand();
			if (selectedCommand) {
				InsertSelectedCommandText(selectedCommand, editor);
			}
		}
	}

	const InsertSelectedCommandText = (selectedCommand, editor) => {
		const caretPosition = editor.view.state.selection.from;
		const typed = CommandIsBeingTyped(editor.getText(), caretPosition);

		const clearTyped = {
			from: caretPosition,
			to: caretPosition - typed.length,
		};

		editor.chain().setTextSelection(clearTyped).run();
		editor.chain().deleteSelection().run();

		const commandStartPosition = editor.view.state.selection.from;
		const stripOldTextLength = editor
			.getText()
			.substring(0, commandStartPosition - 1).length;

		const splitTextByLine = selectedCommand.text.split("\n");
		splitTextByLine.forEach((line, i) => {
			editor.chain().insertContent(line).run();
			if (i !== splitTextByLine.length - 1) editor.chain().setHardBreak().run();
		});

		const braces = GetBraces(editor.getText().substring(stripOldTextLength));
		if (braces && braces.length) {
			editor.commands.setTextSelection({
				from: braces[0].start + stripOldTextLength,
				to: braces[0].end + stripOldTextLength,
			});
		}
	};

	function GetWordAtCursor(str, index) {
		const word = str
			.substring(0, index - 1)
			.split(/\s+/)
			.pop();

		return word;
	}

	function CommandIsBeingTyped(str, index) {
		const currentWord = GetWordAtCursor(str, index);
		if (currentWord.startsWith("/")) return currentWord;
		return false;
	}

	function CopyScratchpad() {
		const selection = editor.view.state.selection;
		const selectionSize = Math.abs(selection.to - selection.from);
		const braces = GetBraces(editor.getText());

		if (selectionSize == 0) {
			if (braces && braces.length > 0) {
				ShowModalUnresolvedBraces(() => {
					navigator.clipboard.writeText(editor.getText());
					showNotification(copiedToClipboard);
				}, null);
			} else {
				navigator.clipboard.writeText(editor.getText());
				showNotification(copiedToClipboard);
			}
		}
	}

	useEffect(() => {
		if (editor && !editor.isDestroyed) {
			editor.commands.insertContent(scratchpadText);
		}
	}, [editor, jsonData]);

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (focused) {
				if (event.key === "Tab" && !event.shiftKey) {
					SelectBraces(1, editor.getText(), editor);
					event.preventDefault(true);
				} else if (event.shiftKey && event.key === "Tab") {
					SelectBraces(-1, editor.getText(), editor);
					event.preventDefault(true);
				} else if (event.key === "c" && event.ctrlKey) {
					CopyScratchpad();
				}
			}
		};

		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [focused]);

	return (
		<Box style={{ height: "100%" }}>
			<Box
				sx={(theme) => ({
					position: "relative",
					display: "flex",
					flexDirection: "column",
					height: "100%",
				})}>
				<Box mb={theme.spacing.xs}>
					<Grid gutter={0}>
						<Col span="content">
							<Title order={5}>Scratchpad</Title>
						</Col>
						<Col span="auto">
							<Group spacing={8} position="right">
								{unresolvedBraces > 0 ? (
									<Tooltip
										position="bottom"
										withArrow
										color={theme.colors.red[8]}
										label={
											<ul
												style={{
													listStyleType: "none",
													margin: 0,
													padding: 0,
												}}>
												{GetBraces(editor.getText()).map(
													(unresolved, index) => {
														return (
															<li key={index}>
																<Text fw={600}>{`{${unresolved.name}}`}</Text>
															</li>
														);
													}
												)}
											</ul>
										}>
										<Group>
											<IconBracesOff size={20} color={theme.colors.red[7]} />
											<Text size="sm" fw={600} color={theme.colors.red[7]}>
												{unresolvedBraces} unresolved variables
											</Text>
										</Group>
									</Tooltip>
								) : (
									<></>
								)}
							</Group>
						</Col>
					</Grid>
				</Box>
				<Divider />
				<Box
					sx={(theme) => ({
						".ProseMirror": {
							height: "100%",
							width: "100%",
							border: 0,
							paddingTop: theme.spacing.sm,
							paddingBottom: theme.spacing.sm,
							borderRadius: theme.radius.sm,
							overflowY: "scroll",
							backgroundColor: theme.colors.gray[0],
							outline: 0,
							"&:focus": {
								outline: 0,
							},
						},
						".ProseMirror p.is-empty::before": {
							color: theme.colors.gray[5],
							content: "attr(data-placeholder)",
							float: "left",
							height: 0,
							fontStyle: "italic",
							pointerEvents: "none",
						},
						".ProseMirror p.is-empty::after": {
							color: theme.colors.gray[5],
							content: "none",
							pointerEvents: "none",
						},
						position: "relative",
						height: "100%",
					})}>
					<Box
						style={{
							border: 0,
							position: "absolute",
							width: `100%`,
							height: `calc(100% - ${theme.spacing.sm * 2}px)`,
						}}>
						<EditorContent
							editor={editor}
							style={{ height: "100%", border: 0 }}
							ref={editorRef}
						/>
					</Box>
				</Box>
				<Divider />
				<CommandList
					ref={refCommandList}
					jsonData={jsonData}
					editor={editor}
					InsertSelectedCommandText={InsertSelectedCommandText}
				/>
				<Box style={{ position: "relative" }}>
					<Group spacing={8} mt={theme.spacing.xs} position="right">
						<Button
							variant="subtle"
							leftIcon={<IconDownload size={16} />}
							onClick={async () => {
								await updateJsonEntry(
									AddNewEntryJSON("New Macro (Scratchpad)", editor.getText())
								);
							}}>
							Save as a new macro
						</Button>
						<Button
							onClick={() => CopyScratchpad()}
							variant="filled"
							leftIcon={<IconCopy size={16} />}>
							Copy to clipboard
						</Button>
					</Group>
				</Box>
			</Box>
		</Box>
	);
};

export default Scratchpad;
