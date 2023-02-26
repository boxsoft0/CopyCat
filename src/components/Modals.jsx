import { Group, Stack, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals/";
import { IconAlertTriangle, IconBracesOff } from "@tabler/icons-react";

export function ShowModalDeleteMacro(
	macroName,
	functionConfirm,
	functionCancel
) {
	openConfirmModal({
		children: (
			<Stack spacing="lg" align="center">
				<Group>
					<IconAlertTriangle size={64} color="red" stroke="2" />
				</Group>
				<Stack spacing="sm" position="center">
					<Text align="center" size="xl" fw={700}>
						Delete macro?
					</Text>
					<Text align="center">
						Are you sure you want to delete <b>"{macroName}"</b>? This action
						cannot be undone.
					</Text>
				</Stack>
			</Stack>
		),
		labels: { confirm: "Delete it", cancel: "Keep it" },
		confirmProps: { color: "red" },
		onConfirm: functionConfirm,
		onCancel: functionCancel,
		centered: true,
	});
}

export function ShowModalDiscardChanges(
	macroName,
	functionConfirm,
	functionCancel
) {
	openConfirmModal({
		children: (
			<Stack spacing="lg" align="center">
				<Group>
					<IconAlertTriangle size={64} color="red" stroke="2" />
				</Group>
				<Stack spacing="sm" position="center">
					<Text align="center" size="xl" fw={700}>
						Discard changes?
					</Text>
					<Text align="center">
						This macro has has unsaved changes. Do you want to discard them?
					</Text>
				</Stack>
			</Stack>
		),
		labels: { confirm: "Discard changes", cancel: "Go back" },
		confirmProps: { color: "red" },
		onConfirm: functionConfirm,
		onCancel: functionCancel,
		centered: true,
	});
}

export function ShowModalUnresolvedBraces(functionConfirm, functionCancel) {
	openConfirmModal({
		children: (
			<Stack spacing="lg" align="center">
				<Group>
					<IconBracesOff size={64} color="red" stroke="2" />
				</Group>
				<Stack spacing="sm" position="center">
					<Text align="center" size="xl" fw={700}>
						You have unresolved variables!
					</Text>
					<Text align="center">
						You are about to copy a message which has unresolved variables. Do
						you still want to copy this message?
					</Text>
				</Stack>
			</Stack>
		),
		labels: { confirm: "Copy anyway", cancel: "Go back" },
		confirmProps: { color: "red" },
		onConfirm: functionConfirm,
		onCancel: functionCancel,
		withCloseButton: false,
		centered: true,
	});
}
