# Very Simple Exchange Rate Website

This is a VERY simple Exchange Rate web site for testing purposes!
It's split in "service" (a standalone app that uses openexchangerates.org as
data source) and "site" (a VERY simple frontend to consume the API exposed
by the service). Both can be run on docker. In order run both servers right
away just type `docker-compose up -d` in the root directory the web site
will be reachable at `http://localhost:8000`!

## Tech

### Requirements:
* docker
* docker-compose

### Running the Project
```sh
$ git clone "git@github.com:emfol/xchgr8.git" target-folder
$ cd target-folder
$ docker-compose up -d
```

## Questions
For questions please send an email to: emfolg@gmail.com
