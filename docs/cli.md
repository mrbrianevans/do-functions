# CLI

Command line interface for building packages to deploy.

The CLI tool is used to configure and manage the build process for your project. It accepts various command line
arguments to customize the behavior of the tool.

## Usage

```
$ do-functions [options] [srcDir] [outDir]
```

- `options`: Optional flags and settings to customize the build process.
- `srcDir`: Optional source directory for input files. If not provided, the default value is `./packages`.
- `outDir`: Optional output directory for built files. If not provided, the default value is `./build`.

## Options

- `--srcDir <path>`
    - Type: string
    - Description: Specifies the source directory for input files. Overrides the `srcDir` provided as a positional
      argument.

- `--outDir <path>`
    - Type: string
    - Description: Specifies the output directory for built files. Overrides the `outDir` provided as a positional
      argument.

- `--project-yml <path>`
    - Type: string
    - Description: Specifies the location of the project YAML configuration file. If not provided, the default location
      is determined based on the `srcDir`.

- `--env <path>`
    - Type: string
    - Description: Specifies the location of the environment configuration file. If not provided, the default location
      is determined based on the `srcDir`.

- `--bundler <bundlerName>`
    - Type: string
    - Description: Specifies the desired bundler for the build process. Options are 'esbuild' or 'rollup'. If not
      provided, 'esbuild' is used by default.

## Examples

1. Build using default settings:
   ```
   $ do-functions
   ```

2. Build with custom source and output directories:
   ```
   $ do-functions --srcDir path/to/source --outDir path/to/output
   ```

3. Specify a custom project YAML configuration file:
   ```
   $ do-functions --project-yml path/to/project.yml
   ```

4. Specify a custom environment configuration file:
   ```
   $ do-functions --env path/to/.env
   ```

5. Choose a specific bundler for the build process (e.g., rollup):
   ```
   $ do-functions --bundler rollup
   ```

## Notes

- If an option is provided both as a command line argument and a positional argument, the command line argument takes
  precedence.

- The bundler specified via the `--bundler` option must be either 'esbuild' or 'rollup'. If an unsupported value is
  provided, 'esbuild' is used by default.

- Paths provided as arguments or options can be either absolute or relative to the current working directory.

## Bundlers

This is based on the example project in the GitHub repo.

|             | Rollup      | esbuild     |
|-------------|-------------|-------------|
| Build Time  | 2.438s      | 41.984ms    |
| Output Size | 29251 bytes | 32477 bytes |

To summarise these results:

- esbuild = faster
- rollup + terser = smaller
