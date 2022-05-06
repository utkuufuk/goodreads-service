# goodreads-service
[![CI](https://github.com/utkuufuk/goodreads-service/actions/workflows/ci.yml/badge.svg)](https://github.com/utkuufuk/goodreads-service/actions/workflows/ci.yml)
![Latest Release](https://img.shields.io/github/release/utkuufuk/goodreads-service.svg)
[![Coverage Status](https://coveralls.io/repos/github/utkuufuk/goodreads-service/badge.svg)](https://coveralls.io/github/utkuufuk/goodreads-service)

A simple service to poll an RSS feed from [Goodreads](https://www.goodreads.com). Can be used as a data source for [`entrello`](https://github.com/utkuufuk/entrello).

## Development
Create a `.env` file in the project root directory based on `.env.example`.

```sh
# install dependencies
yarn

# run tests
yarn test

# lint
yarn lint

# build
yarn build

# poll the RSS feed
yarn start poll

# start web server
yarn start serve
```


## Running With Docker
A new [Docker image](https://github.com/utkuufuk?tab=packages&repo_name=goodreads-service) will be created upon each [release](https://github.com/utkuufuk/goodreads-service/releases).

1. Authenticate with the GitHub container registry (only once):
    ```sh
    echo $GITHUB_ACCESS_TOKEN | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
    ```

2. Pull the latest Docker image:
    ```sh
    docker pull ghcr.io/utkuufuk/goodreads-service/image:latest
    ```

3. Start the server:
    ```sh
    docker run -d \
        -p <PORT>:<PORT> \
        --env-file </absolute/path/to/.env> \
        --restart unless-stopped \
        --name goodreads-service \
        ghcr.io/utkuufuk/goodreads-service/image:latest
    ```
