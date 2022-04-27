# goodreads-service

## Development
Firstly, create a `.env` file in the repository root directory that is structured similarly to `.env.example`.

```sh
# install dependencies
yarn install --frozen-lockfile --ignore-optional

# run tests
yarn test

# run linting
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
