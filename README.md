# ga-dree
This github action is mainly used to generate a nice directory tree representation of the github repo in markdown files, injected where a specific comment is specified.

## Project purpose

In many Github projects it is nice to put a **directory tree representation** in the **README**, to give an overview of the structure of the project, without making a user to inspect the various files and folders. This action does exactly this: it's basic usage generates a directory tree representation of the repository and injects it in the README file, where a specific comment is specified. It is also **customizable**, so you can choose which markdown file should be injected, which comment triggers the injection and other options, (e.g. exclude some files/folders from the tree representation).

## Dree

This action is based on the **[dree npm module](https://dree.euber.dev)**. Indeed, the config file that can be specified is the same config file that could be provided to that module.

## Result

Let's suppose that this is your markdown file:

```md
# My project

A description of my project

## Directory tree

[//]: # (dree)

```

The result will be something like:

```md

# My project

A description of my project

## Directory tree

[//]: # (dree - BEGIN)
myproject
 ├── LICENSE
 ├── README.md
 └─> sample
     ├── primo.java
     ├─> prova1
     │   └── secondo.yml
     ├─> prova2
     │   ├── ciao.html
     │   └── pippo.txt
     └─> prova3
         ├─> terzo
         │   └── quarto.ts
         └── quinto.js
[//]: # (dree - END)

```

## Example

A simple example:

```yml
name: release

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
            ref: main
      
      # This is how you use the ga-dree action
      - name: Inject dree
        uses: 'euberdeveloper/ga-dree@main'

      # In this step the changes to the branch are committed
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "docs: inject dree (automated commit)"
          branch: main

```

A more advanced exmaple:

```yml
name: release

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
            ref: main
      
      # This is how you use the ga-dree action
      - name: Inject dree
        uses: 'euberdeveloper/ga-dree@main'
        with:
            showMadeWithDree: 'false' # Does not add "Made with dree"
            config: './docs/dree-config.json' # The path to the config file for the package dree
            comment: 'my-custom-dree-comment' # The comment that triggers the injection of the dree tree
            root: './source' # The root directory of the generated tree
            exclude: 'node_modules' # The files/folders to exclude from the tree
            targetPath: './docs/README.md' # The path of the file where the tree should be injected

      # In this step the changes to the branch are committed
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "docs: inject dree (automated commit)"
          branch: main

```

## API

### Supported Parameters

| Parameter         | Description                                                                                                                                        | Default     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `package-manager` | The package manager of your project (`npm`, `composer`, `maven`, `poetry` or `pipenv`).                                                                                | `npm`       |
| `root-directory`  | The root directory (containing your `.json/.xml/.toml` file)                                                                                             | `./`        |
| `path`            | If you have a custom json file containing the version of the project, you can specify its full path.                                               | `undefined` |
| `version-prop`    | If in the json/xml/toml file the property containing the version is not called `version`, you can set it here. The key can be nested, like in `uno.due.tre` | `undefined` / for most cases the action behaves smartly for each package manager   |

**Note:** If `path` is specified, `package-manager` and `root-directory` are ignored.

## How does it works

### How is it made

Internally, the action is written in **Typescript**, tested with **Jest** and bundled with **EsBuild**.

### Steps that are followed

This is what it happens under the hood:
* The action options are parsed
* The action generates the tree representation of the repository, by considering the options regarding [dree](https://dree.euber.dev) and the tree representation
* The action generates the markdown that will be injected, in particular, it adds the "made with dree" if specified and the "begin-end" comments for the subsequent injections
* The action injects the markdown in the specified markdown file, comment added by the users will be replaced by the directory tree and the begin-end comments, while already present begin-end comments will be replaced, with their content, with the new injected markdown.

### Note

There is the assumption that the begin-end comments are added consistently, so there is no new "begin" comment before another "begin" comment is not closed, or there is no new "end" comment before a "begin" comment is opened.

### Development

The commits are pushed to the branch `dev`, after that an action will generate the bundle and push everything in the branch `main`. For versioning, releases are manually created.
