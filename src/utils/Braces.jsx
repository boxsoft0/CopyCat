export function GetBraces(text) {
	const matches = text.match(/{[^}]+}/g);
	if (!matches) return [];

	const braces = [];

	let startSearchPosition = 0;
	let remainingSearchText = text;

	matches.forEach((match, i) => {
		const index = i;
		const name = match.substring(1, match.length - 1);
		const start = remainingSearchText.indexOf(match) + 1;
		const end = start + match.length;
		const length = match.length;

		braces.push({
			index: index,
			name: name,
			start: start + startSearchPosition,
			end: end + startSearchPosition,
			length: length,
		});

		startSearchPosition += end - 1;
		remainingSearchText = remainingSearchText.slice(end - 1);
	});

	return braces;
}

export function SelectBraces(direction, text, editor) {
	const braces = GetBraces(text);
	const cursorPosition = {
		from: editor.view.state.selection.from,
		to: editor.view.state.selection.to,
	};
	const selectionSize = editor.state.doc.textBetween(
		cursorPosition.from,
		cursorPosition.to
	).length;

	direction > 0
		? braces.sort((a, b) => a.start - b.start)
		: braces.sort((a, b) => b.start - a.start);

	const selectedBraces = braces.find((brace) => {
		return direction > 0
			? brace.end > cursorPosition.to
			: brace.start < cursorPosition.from;
	});

	if (!selectedBraces) return;
	editor.commands.setTextSelection({
		from: selectedBraces.start,
		to: selectedBraces.end,
	});
}
