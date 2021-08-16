# Simple Dashboard Application

## Description
Visualise campaigns data on chart.

#### Usage
1. Go to main directory
2. Copy `.env.template` into `.env` (you can leave values as default).
3. Go to `frontend` directory and copy `.env.template` into `.env` (you can leave values as default).
4. Go back to main directory and run:
```
docker-compose build
docker-compose up
```
5. Run migration
```
docker exec -t dashboard-backend python manage.py migrate
```
6. Load csv data using python manage command. [See here.](#load-campaign-data)
7. Open the app in browser (by default: http://localhost:3000/)
8. Chart will be initially loaded with whole data set. 

#### Linters and code formatters
That project is formatted using black, isort, prettier and eslint. To enable run in main folder:
```
pre-commit install
yarn
```
After that before commit code will be formatted automatically. 

#### Backend
Backend is responsible for filtering and returning data. That way heavy computation is delegated
to client application and is reducing load on the server.
Of course depending on a use case aggregation could be done on BE side with some
caching strategy. That would improve user experience due to reduced loading times, however server
maintenance would be more costly.
Decision would depend on how this data is used, how much is expected, etc.

#### Frontend
I decided to do heavy computation on the Frontend side due to the fact that I wanted to present
frontend skills mostly.


## Improvements
What could be improved:
- Use global admin action to fetch csv data instead of using manage.py command.
- Add support for aborting fetching campaigns data (right now button for applying filters is disabled).
- Add more tests.
- Add some backend caching.
- Use some worker (e.g. celery) to load campaigns data.
- Some styling and UX could be improved.

## Commands

### Load campaign data
```
python manage.py load_campaign_data [csv_url]
```
For example:
```
python manage.py load_campaign_data http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv
```
or using docker

```
docker exec -t dashboard-backend python manage.py load_campaign_data http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv
```

### Running tests
Backend:
```
docker exec -t dashboard-backend python manage.py test
```
Frontend:
```
docker exec -t dashboard-frontend yarn test
```
