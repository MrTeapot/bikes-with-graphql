# bikes-graphql
## Start development

To start the database and nodejs server in development mode, run this command in your terminal:
``` bash
docker-compose up
```

If it's your first time starting, or if you have added new migration files. Run this in another terminal tab to migrate the development database:
``` bash
docker-compose run server npm run migrate up --rm
```

## API documentation
Is available in the Graphiql web interface, visit http://localhost:5000/graphql when the development server is running. See docs tab in top right.
You can also look at the test files for usage examples.

## Run tests
Run this command:
``` bash
./scripts/run_tests.sh 
```
On Windows, run: ```bash ./scripts/run_tests.sh```
Todo: make the tests run independently, truncate and arrange/seed database with every test.

## Build for production
Run this:
``` bash
./scripts/build_prod.sh 
```
Push the image to your docker registry or run in a CI/CD pipeline.
When running in your production environment, provide a Postgres connection string in an environment variable called ```POSTGRES_DB_URL```.
If you wish to require a password for the officer api, provide the environment variable ```OFFICER_PW``` with the password.
Make sure to set the environment variable ```NODE_ENV``` to ```production```

## The architecture
The domains/features (officers, cases and assignments) consists of two or three components:  ```repositories``` (abstracting away data access from business logic), ```services``` (business logic), and  ```resolvers``` (mapping graphql queries/mutations input to service input).
Services can also use an EventsEmitter to dispatch events that are of interest to other features, in order to decouple the features. Using RabbitMQ or similiar for this would be a better choice.