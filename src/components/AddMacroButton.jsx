import { showNotification } from "@mantine/notifications";
import { Group, UnstyledButton } from "@mantine/core";
import { AddNewEntryJSON } from "../utils/DataManager";
import { ShowModalDiscardChanges } from "./Modals";
import { addedNewMacro } from "./Notifications";
import { IconPlus } from "@tabler/icons-react";

export default function AddMacroButton({ updateJsonEntry, page, editorRef }) {
	return (
		<UnstyledButton
			onClick={async () => {
				if (editorRef?.current?.CheckForUnsavedChanges(page)) {
					ShowModalDiscardChanges(
						editorRef?.current?.GetFormValues().name,
						async () => {
							await updateJsonEntry(AddNewEntryJSON());
							showNotification(addedNewMacro);
						}
					);
				} else {
					await updateJsonEntry(AddNewEntryJSON());
					showNotification(addedNewMacro);
				}
			}}
			py={20}
			sx={(theme) => ({
				width: "100%",
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
			<Group spacing={8} position="center" mr={4}>
				<IconPlus size={20} />
				Create a new macro
			</Group>
		</UnstyledButton>
	);
}
