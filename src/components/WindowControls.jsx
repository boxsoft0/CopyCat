import { appWindow } from "@tauri-apps/api/window";
import React from "react";
import { Group, UnstyledButton } from "@mantine/core";
import {
	IconChevronDown,
	IconMinus,
	IconSquare,
	IconX,
} from "@tabler/icons-react";
import { ShowModalDiscardChanges } from "./Modals";
import DropdownMenu from "./DropdownMenu";
import { SetSettings } from "../utils/DataManager";

export default function WindowControls({ page, updateJsonArray, editorRef }) {
	return (
		<Group
			data-tauri-drag-region
			spacing={0}
			position="right"
			style={{ height: "100%" }}>
			<DropdownMenu updateJsonArray={updateJsonArray}>
				<UnstyledButton
					tabIndex={-1}
					px={16}
					sx={(theme) => ({
						height: "100%",

						"&:hover": {
							backgroundColor: theme.colors.blue[7],
						},
						"&:active": {
							paddingTop: 2,
						},
					})}>
					<IconChevronDown size={14} stroke={3} color="white" />
				</UnstyledButton>
			</DropdownMenu>

			<UnstyledButton
				tabIndex={-1}
				onClick={() => appWindow.minimize()}
				px={16}
				sx={(theme) => ({
					height: "100%",

					"&:hover": {
						backgroundColor: theme.colors.blue[7],
					},
					"&:active": {
						paddingTop: 2,
					},
				})}>
				<IconMinus size={14} stroke={3} color="white" />
			</UnstyledButton>
			<UnstyledButton
				tabIndex={-1}
				onClick={() => appWindow.toggleMaximize()}
				px={16}
				sx={(theme) => ({
					height: "100%",
					"&:hover": {
						backgroundColor: theme.colors.blue[7],
					},
					"&:active": {
						paddingTop: 2,
					},
				})}>
				<IconSquare size={14} stroke={3} color="white" />
			</UnstyledButton>
			<UnstyledButton
				tabIndex={-1}
				onClick={async () => {
					if (!editorRef?.current?.CheckForUnsavedChanges(page)) {
						await SetSettings({
							resolution: await appWindow.innerSize(),
							position: await appWindow.innerPosition(),
						});
						appWindow.close();
					} else {
						ShowModalDiscardChanges(
							editorRef?.current?.GetFormValues().name,
							() => {
								SetSettings({ resolution: appWindow.innerSize() });
								appWindow.close();
							}
						);
					}
				}}
				px={16}
				sx={(theme) => ({
					height: "100%",
					"&:hover": {
						backgroundColor: theme.colors.red[8],
					},
					"&:active": {
						paddingTop: 2,
					},
				})}>
				<IconX size={14} stroke={3} color="white" />
			</UnstyledButton>
		</Group>
	);
}
