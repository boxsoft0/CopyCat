import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme, _params, getRef) => ({
	wrapper: {
		backgroundColor: theme.colors.gray[0],
		padding: theme.spacing.md,
		borderRadius: theme.radius.sm,
	},

	input: {
		flex: 1,
		input: {
			color: theme.colors.gray[9],
			backgroundColor: "white",
			"&:disabled": {
				color: theme.colors.gray[9],
				border: "1px solid rgba(0,0,0,0)",
				opacity: 100,
				backgroundColor: theme.colors.gray[1],
			},
		},

		textarea: {
			height: "100%",
			color: theme.colors.gray[9],
			backgroundColor: "white",
			"&:disabled": {
				color: theme.colors.gray[9],
				border: "1px solid rgba(0,0,0,0)",
				opacity: 100,
				backgroundColor: theme.colors.gray[1],
			},
		},
	},

	command: {
		input: {
			fontFamily: "monospace",
			color: theme.colors.gray[9],
			backgroundColor: "white",
			"&:disabled": {
				color: theme.colors.gray[9],
				border: "1px solid rgba(0,0,0,0)",
				opacity: 100,
				backgroundColor: theme.colors.gray[1],
			},
		},
	},
}));

export default useStyles;
