#!/bin/sh
curl -X POST http://localhost:5000/api/users/ \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d '{
  "username": "charles",
  "email": "cancheta@ualberta.ca",
  "password": "Mint@2020!"
}'
echo ''
