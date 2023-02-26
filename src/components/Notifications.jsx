import {
	IconCopy,
	IconPlus,
	IconCheck,
	IconScissors,
} from "@tabler/icons-react";

export const copiedToClipboard = {
	title: "Copied!",
	message: "Macro copied to clipboard.",
	color: "green",
	autoClose: 1200,
	icon: <IconCopy size={16} />,
	disallowClose: false,
};

export const savedMacro = (name) => ({
	title: "Saved!",
	message: `Saved macro "${name}".`,
	color: "blue",
	autoClose: 1200,
	icon: <IconCheck size={16} />,
	disallowClose: false,
});

export const addedNewMacro = {
	title: "Added!",
	message: "A new macro has been added to the list.",
	color: "blue",
	autoClose: 1200,
	icon: <IconPlus size={16} />,
	disallowClose: false,
};

export const snippedMacro = {
	title: "Snipped macro!",
	message: "Create a snippet from selected text!",
	color: "green",
	autoClose: 2000,
	icon: <IconScissors size={16} />,
	disallowClose: false,
};
