import React from "react";
import { Menu } from "@mantine/core";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";
import { ExportJsonFile, ImportJsonFile } from "../utils/DataManager";

export default function DropdownMenu({ children, updateJsonArray }) {
	return (
		<Menu shadow="md" width={200}>
			<Menu.Target>{children}</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Data</Menu.Label>
				<Menu.Item
					icon={<IconFileImport stroke={1.5} size={22} />}
					onClick={async () => {
						updateJsonArray(await ImportJsonFile());
					}}>
					Import macros
				</Menu.Item>
				<Menu.Item
					icon={<IconFileExport stroke={1.5} size={22} />}
					onClick={async () => await ExportJsonFile()}>
					Export macros
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}
