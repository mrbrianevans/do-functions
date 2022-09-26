// boolean of whether a file exists or not
import {stat} from "fs/promises";

export async function fileExists(filename: string) {
  const s = await stat(filename).catch(e => null)
  return s?.isFile()
}

// returns the first file path which exists
export async function firstExists(...filePaths: string[]) {
  for (const file of filePaths) if (await fileExists(file)) return file
}
