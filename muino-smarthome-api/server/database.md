

# INFLUX DB

``` bash 
# admin (8003) and graphical (2003) enabled 
docker run -p 8086:8086 -p 2003:2003 -p 8083:8083 \
    -e INFLUXDB_GRAPHITE_ENABLED=true \
    -e INFLUXDB_ADMIN_ENABLED=true \
    influxdb

 

```

https://www.influxdata.com/blog/getting-started-with-node-influx/.