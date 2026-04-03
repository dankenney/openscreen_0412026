import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const releaseRoot = path.join(rootDir, "release");

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

	const result = spawnSync("taskkill", ["/IM", "Openscreen.exe", "/F", "/T"], {
		encoding: "utf-8",
		stdio: "pipe",
	});

	if (result.status === 0) {
		console.log("Stopped running Openscreen.exe processes before packaging.");
		return;
	}

	const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
	const processNotRunning =
		/no running instance/i.test(output) ||
		/not found/i.test(output) ||
		/cannot find the process/i.test(output);

	if (processNotRunning) {
		console.log("No running Openscreen.exe process found.");
		return;
	}

	throw new Error(output || "Failed to stop Openscreen.exe before packaging.");
}

async function removePreviousRelease(version) {
	const releaseDir = ensureWithinReleaseRoot(path.join(releaseRoot, version));
	await fs.rm(releaseDir, { recursive: true, force: true });
	console.log(`Prepared clean Windows release directory: ${path.relative(rootDir, releaseDir)}`);
}

const version = await readPackageVersion();
stopRunningPackagedApp();
await removePreviousRelease(version);
