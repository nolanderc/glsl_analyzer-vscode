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

let client: LanguageClient | null = null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('glsl-analyzer.restartClient', startClient),
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('glsl-analyzer.stopClient', stopClient),
	);

	await startClient();
}

// This method is called when your extension is deactivated
export async function deactivate() {
	await stopClient();
}

async function startClient() {
	if (client) {
		await stopClient();
		client = null;
	}

	let client_options: LanguageClientOptions = {
		documentSelector: [
			{ scheme: 'file', language: 'glsl' }
		]
	};
	let executable: Executable = {
		command: "glsl_analyzer",
		args: ["--dev-mode=/home/christofer/dev/glsl_analyzer/stderr.log"],
		transport: TransportKind.stdio,
	};
	let server_options: ServerOptions = executable;
	client = new LanguageClient("glsl_analyzer", server_options, client_options);
	await client.start();

	vscode.window.showInformationMessage("started glsl_analyzer!");
}

async function stopClient() {
	if (!client) return;
	vscode.window.showInformationMessage("stopping glsl_analyzer...");
	await client.stop();
	client = null;
}