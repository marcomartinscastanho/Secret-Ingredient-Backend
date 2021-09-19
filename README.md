# Secret-Ingredient-Backend

Backend serving a REST API to manage recipes

Project developed in TypeScript using [Nest](https://docs.nestjs.com/).  
It uses a mongodb database with a server running on a docker environment.

## API Documentation

The application provides API Documentation using Swagger.  
In order to access the Documentation, you first need to install [[1]](#Installation) and run the app [[2]](#Running).
Then open a web browser and go to `http://localhost:<SERVER_PORT>/docs`, where `SERVER_PORT` is the port where the application is running, and should be set as an environment variable before running the app [[3]](#Environment).  
The Swagger API Documentation not only acts as a library displaying all endpoints, available methods, expected input and output schemas, but it can also be used as a REST client, allowing to send requests to the application endpoints, also supporting authentication [[4]](#Authentication).

## Installation

In order to download and install all the required packages, run

```bash
$ npm install
```

## Environment

The project makes use of custom environment variables.  
Here's a list of environment variables that should be set before starting the application, along with example values for those variables:

```bash
SERVER_PORT=14061
JWT_SECRET=061442414dd270a3f5a674d14556b9bed28e6ec50e3d68df14c14b6b5ed26009
JWT_EXPIRATION=1d
```

## Running the app

```bash
# start the database
$ docker-compose up

# development
$ npm run start
```

## Authentication

The application's endpoints are authenticated. Users must register and/or login with valid credentials in order to be able to access the endpoints.  
For this, the API provides `/auth/register` and `/auth/login` endpoints which a user can call to register and gain access to `/users`.  
Both the `/auth/register` and the `/auth/login` endpoints return a JWT access token unpon success. This access token is required as an Authorization header in all requests to `/users`, as

```
Authorization: Bearer {{accessToken}}
```

The `/auth/register` also creates the User in the database as a Normal User.  
Becasue only Admin users are allowed create other Admin users, the application comes with a default Admin user from the start, that can be user to create other users.  
The properties of the default Admin user are:

```
name: Default Admin
username: admin
password: #SecrIng21
```

## Test

```bash
# Unit tests
$ npm run test

# E2E tests
$ docker-compose up
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

### Test Coverage

```bash
# Unit tests
Test cases: 39
Coverage: 97%

# E2E tests
Test cases: 136
Coverage: 100%

Also manually tested using the Swagger API.
```
