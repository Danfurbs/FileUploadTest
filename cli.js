#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);
const DEFAULT_DEST = path.join(__dirname, 'uploads');

function showHelp() {
  console.log(`Standalone file capture\n\n` +
    `Usage:\n` +
    `  node cli.js --file <path> [--dest <folder>] [--name <new name>]\n` +
    `  node cli.js                             # prompts for a file path\n\n` +
    `Options:\n` +
    `  -f, --file   Path to the file you want to store\n` +
    `  -d, --dest   Folder to place the stored file (default: ./uploads)\n` +
    `  -n, --name   Optional new filename; defaults to timestamp + original name\n` +
    `  -h, --help   Show this message\n`);
}

function parseArgs(argv) {
  const opts = { };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '-h':
      case '--help':
        opts.help = true;
        break;
      case '-f':
      case '--file':
        opts.file = argv[i + 1];
        i += 1;
        break;
      case '-d':
      case '--dest':
        opts.dest = argv[i + 1];
        i += 1;
        break;
      case '-n':
      case '--name':
        opts.name = argv[i + 1];
        i += 1;
        break;
      default:
        if (!arg.startsWith('-') && !opts.file) {
          opts.file = arg;
        }
        break;
    }
  }
  return opts;
}

function promptForPath() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('Path of the file to store: ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyToUploads(sourcePath, destDir, desiredName) {
  const sourceStat = await fs.promises.stat(sourcePath);
  if (!sourceStat.isFile()) {
    throw new Error('The path you provided is not a file');
  }

  const baseName = desiredName || `${Date.now()}-${path.basename(sourcePath)}`;
  const targetDir = destDir || DEFAULT_DEST;
  const resolvedTargetDir = path.resolve(targetDir);
  await ensureDir(resolvedTargetDir);

  const targetPath = path.join(resolvedTargetDir, baseName);
  await pipelineAsync(fs.createReadStream(sourcePath), fs.createWriteStream(targetPath));
  return targetPath;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    showHelp();
    return;
  }

  const inputPath = options.file || await promptForPath();
  if (!inputPath) {
    console.error('No file provided. Provide --file or enter a path when prompted.');
    process.exit(1);
  }

  const resolvedPath = path.resolve(inputPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  try {
    const savedAt = await copyToUploads(resolvedPath, options.dest, options.name);
    console.log(`Stored a copy at: ${savedAt}`);
  } catch (error) {
    console.error(`Upload failed: ${error.message}`);
    process.exit(1);
  }
}

main();
