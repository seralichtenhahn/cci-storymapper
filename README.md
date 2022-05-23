![Repo Header](/docs/bg.jpg?raw=true)

# Storymapper

> A tool for visualizing places and routes on a map.

## Installation

### Dependencies

#### Python and Pip

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install the requirements.

Create a virtual environment and activate it

```sh
python3 -m venv .venv
source .venv/bin/activate
```

Install the dependencies

```sh
pip install -r requirements.txt
```

#### Node

Download the latest version of Node.js from their website: https://nodejs.org/en/

#### yarn

Make sure to install this globally

```sh
npm install -g yarn
```

Install the project dependencies

```sh
yarn i
```

## Environment variables

Create a `.env` file at the root of this project. This file is _gitignored_ and should never be commited but it's used to provide secrets within the project. You can find the variables that are required in the `.env.dist` file.

## Running locally

To launch the server:

```sh
yarn dev
```

Go to http://localhost:3000
