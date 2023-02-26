import { Mark } from "@mantine/core";

export function MarkSearchQuery(str, searchQuery) {
	if (!searchQuery) return str;

	const regex = new RegExp(`(${searchQuery})`, "gi");
	const markedStr = str.split(regex).map((word, index) => {
		return word.toLowerCase() === searchQuery.toLowerCase() ? (
			<Mark key={index}>{word}</Mark>
		) : (
			word
		);
	});

	return <>{markedStr}</>;
}
