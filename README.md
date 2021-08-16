# Simple Dashboard Application


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
```
    docker exec -t dashboard-backend python manage.py test
```
