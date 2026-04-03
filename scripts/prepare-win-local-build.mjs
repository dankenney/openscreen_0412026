import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const releaseRoot = path.join(rootDir, "release");
const PACKAGED_EXECUTABLE_NAMES = ["OpenScreen.exe", "Openscreen.exe"];

function ensureWithinReleaseRoot(targetPath) {
	const resolvedTarget = path.resolve(targetPath);
	const resolvedReleaseRoot = path.resolve(releaseRoot);

	if (
		resolvedTarget !== resolvedReleaseRoot &&
		!resolvedTarget.startsWith(`${resolvedReleaseRoot}${path.sep}`)
	) {
		throw new Error(`Refusing to remove path outside release directory: ${resolvedTarget}`);
	}

	return resolvedTarget;
}

async function readPackageVersion() {
	const packageJsonPath = path.join(rootDir, "package.json");
	const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

	if (typeof packageJson.version !== "string" || packageJson.version.trim() === "") {
		throw new Error("package.json is missing a valid version field.");
	}

	return packageJson.version.trim();
}

function stopRunningPackagedApp() {
	if (process.platform !== "win32") {
		return;
	}

	let stoppedAnyProcess = false;
	const unexpectedErrors = [];

	for (const executableName of PACKAGED_EXECUTABLE_NAMES) {
		const result = spawnSync("taskkill", ["/IM", executableName, "/F", "/T"], {
			encoding: "utf-8",
			stdio: "pipe",
		});

		if (result.status === 0) {
			stoppedAnyProcess = true;
			console.log(`Stopped running ${executableName} before packaging.`);
			continue;
		}

		const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
		const processNotRunning =
			/no running instance/i.test(output) ||
			/not found/i.test(output) ||
			/cannot find the process/i.test(output);

		if (!processNotRunning) {
			unexpectedErrors.push(output || `Failed to stop ${executableName} before packaging.`);
		}
	}

	if (unexpectedErrors.length > 0) {
		throw new Error(unexpectedErrors.join("\n\n"));
	}

	if (stoppedAnyProcess) {
		return;
	}

	console.log("No running OpenScreen.exe or Openscreen.exe process found.");
}

async function removePreviousRelease(version) {
	const releaseDir = ensureWithinReleaseRoot(path.join(releaseRoot, version));
	await fs.rm(releaseDir, { recursive: true, force: true });
	console.log(`Prepared clean Windows release directory: ${path.relative(rootDir, releaseDir)}`);
}

const version = await readPackageVersion();
stopRunningPackagedApp();
await removePreviousRelease(version);
