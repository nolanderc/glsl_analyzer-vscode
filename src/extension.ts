// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	Executable
} from 'vscode-languageclient/node';
import axios from 'axios';
import * as AdmZip from 'adm-zip';
import { mkdirp } from 'mkdirp';
import * as fs from 'fs';
import { spawnSync } from 'child_process';
import { stdout } from 'process';

let client: LanguageClient | null = null;
let config: vscode.WorkspaceConfiguration;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	config = vscode.workspace.getConfiguration("glsl-analyzer", { languageId: 'glsl' });

	context.subscriptions.push(
		vscode.commands.registerCommand('glsl-analyzer.restartClient', () => startClient(context)),
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('glsl-analyzer.stopClient', () => stopClient()),
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('glsl-analyzer.download', async () => {
			await stopClient();
			await downloadLatestRelease(context);
			await startClient(context);
		}),
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('glsl-analyzer.version', () => {
			const exe_path: string | undefined = config.get('path');
			if (exe_path) {
				const result = spawnSync(exe_path, ['--version']);
				vscode.window.showInformationMessage('glsl_analyzer version: ' + result.stdout.toString());
			}
		}),
	);

	await startClient(context);
}

// This method is called when your extension is deactivated
export async function deactivate() {
	await stopClient();
}

async function startClient(context: vscode.ExtensionContext) {
	if (client) {
		await stopClient();
		client = null;
	}

	var executable_path: string | undefined = config.get('path');
	if (!executable_path) {
		const downloaded_path = await downloadLatestRelease(context);
		if (!downloaded_path) return;
		executable_path = downloaded_path.fsPath;
	}

	let client_options: LanguageClientOptions = {
		documentSelector: [
			{ scheme: 'file', language: 'glsl' }
		]
	};
	let executable: Executable = {
		command: executable_path,
		args: ["--dev-mode=/home/christofer/dev/glsl_analyzer/stderr.log"],
		transport: TransportKind.stdio,
	};
	let server_options: ServerOptions = executable;
	let tmp_client = new LanguageClient("glsl_analyzer", server_options, client_options);
	await tmp_client.start();
	client = tmp_client;
	vscode.window.showInformationMessage("started glsl_analyzer!");
}

async function stopClient() {
	if (!client) return;
	vscode.window.showInformationMessage("stopping glsl_analyzer...");
	await client.stop();
	client = null;
}

const github_repo_url = "https://github.com/nolanderc/glsl_analyzer"

async function downloadLatestRelease(context: vscode.ExtensionContext): Promise<vscode.Uri | null> {
	const target = getDefaultTargetName();
	if (!target) {
		vscode.window.showErrorMessage(
			`A binary for your system (${process.arch}-${process.platform}) isn't built by our CI!\n`
			+ `Follow the instructions [here](${github_repo_url}) to get started.`
		);
		return null;
	}

	return await vscode.window.withProgress({
		title: "Installing glsl_analyzer...",
		location: vscode.ProgressLocation.Notification,
	}, async progress => {
		const url = `${github_repo_url}/releases/latest/download/${target}.zip`;
		console.log(url);

		progress.report({ message: "Downloading archive..." });
		const archive_bytes = (await axios.get(url, {
			responseType: 'arraybuffer',
		})).data;

		progress.report({ message: "Extracting archive..." });
		const install_directory = getInstallDirectory(context);
		const download_directory = install_directory.fsPath + '.tmp';

		if (!fs.existsSync(download_directory)) {
			mkdirp.sync(download_directory);
		}

		var zip = new AdmZip(archive_bytes);
		zip.extractAllTo(download_directory, true);

		progress.report({ message: "Installing..." });
		fs.chmodSync(download_directory + '/bin/' + getExecutableName(), 0o755);
		if (fs.existsSync(install_directory.fsPath)) {
			fs.rmSync(install_directory.fsPath, { recursive: true, force: true });
		}
		fs.renameSync(download_directory, install_directory.fsPath);

		const exe_path = getExecutablePath(context);
		if (!fs.existsSync(exe_path.fsPath)) {
			vscode.window.showErrorMessage("Installation failed");
			return null;
		}

		await config.update("path", exe_path.fsPath, true);

		return exe_path;
	});
}

function getExecutablePath(context: vscode.ExtensionContext): vscode.Uri {
	const install_directory = getInstallDirectory(context);
	return vscode.Uri.joinPath(install_directory, "bin", getExecutableName());
}

function getExecutableName(): string {
	const extension = process.platform == 'win32' ? '.exe' : '';
	return "glsl_analyzer" + extension;
}

function getInstallDirectory(context: vscode.ExtensionContext): vscode.Uri {
	return vscode.Uri.joinPath(context.globalStorageUri, "glsl_analyzer_install");
}

function getDefaultTargetName(): string | null {
	if (process.platform == 'linux') {
		if (process.arch == 'x64') return 'x86_64-linux-musl';
		if (process.arch == 'arm64') return 'aarch64-linux-musl';
	}

	if (process.platform == 'win32') {
		if (process.arch == 'x64') return 'x86_64-windows';
		if (process.arch == 'arm64') return 'aarch64-windows';
	}

	if (process.platform == 'darwin') {
		if (process.arch == 'x64') return 'x86_64-macos';
		if (process.arch == 'arm64') return 'aarch64-macos';
	}

	return null;
}