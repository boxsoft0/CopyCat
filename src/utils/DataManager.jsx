import {
	readTextFile,
	writeTextFile,
	createDir,
	exists,
	BaseDirectory,
} from "@tauri-apps/api/fs";
import { open as openDialog, save as saveDialog } from "@tauri-apps/api/dialog";
import { v4 as uuid } from "uuid";

export async function GetJson() {
	const dirExists = await exists("", { dir: BaseDirectory.AppData });

	if (!dirExists) {
		await createDir("", { dir: BaseDirectory.AppData });
	}

	const fileExists = await exists("macros.json", {
		dir: BaseDirectory.AppData,
	});

	if (fileExists) {
		const jsonData = JSON.parse(
			await readTextFile("macros.json", {
				dir: BaseDirectory.AppData,
			})
		);

		return jsonData;
	} else {
		await writeTextFile("macros.json", "[]", {
			dir: BaseDirectory.AppData,
		});

		return GetJson();
	}
}

export async function GetSettings() {
	return await readTextFile("settings.json", {
		dir: BaseDirectory.AppData,
	});
}

export async function SetSettings(newSettings) {
	await writeTextFile("settings.json", JSON.stringify(newSettings), {
		dir: BaseDirectory.AppData,
	});
}

export function RemoveJsonObject(jsonData, jsonObjectToRemove) {
	const index = jsonData.findIndex((obj) => obj.id == jsonObjectToRemove.id);
	if (index != -1) {
		const newArray = jsonData.slice();
		newArray.splice(index, 1);
		return newArray;
	}

	return jsonData;
}

export function AddNewEntryJSON(name = "New Macro", text = "", command = "") {
	return {
		id: uuid(),
		name: name,
		text: text,
		command: command,
	};
}

export async function SaveFileJSON(jsonArray) {
	await writeTextFile("macros.json", JSON.stringify(jsonArray), {
		dir: BaseDirectory.AppData,
	});
	return jsonArray;
}

export function MergeJsonFiles(existingJsonData, importedJsonData) {
	const mergedJsonData = [];

	for (const objA of existingJsonData) {
		const objB = importedJsonData.find((obj) => obj.id === objA.id);
		if (objB) {
			mergedJsonData.push(objB);
		} else {
			mergedJsonData.push(objA);
		}
	}

	for (const objB of importedJsonData) {
		const objA = existingJsonData.find((obj) => obj.id === objB.id);
		if (!objA) {
			mergedJsonData.unshift(objB);
		}
	}

	return mergedJsonData;
}

export async function ImportJsonFile() {
	const importedJsonPath = await openDialog({
		multiple: false,
		filters: [
			{
				name: "CopyCat Macros",
				extensions: ["json"],
			},
		],
	});

	if (importedJsonPath) {
		const importedJson = JSON.parse(await readTextFile(importedJsonPath));
		const mergedJsonData = MergeJsonFiles(await GetJson(), importedJson);
		await SaveFileJSON(mergedJsonData);

		return mergedJsonData;
	}
}

export async function ExportJsonFile() {
	const exportedJsonPath = await saveDialog({
		filters: [
			{
				name: "CopyCat Macros",
				extensions: ["json"],
			},
		],
	});

	if (exportedJsonPath) {
		await writeTextFile(exportedJsonPath, JSON.stringify(await GetJson()));
	}
}
