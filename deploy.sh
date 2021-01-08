#!/bin/bash
cd 1village
sudo docker stop 1village && sudo docker rm 1village
sudo docker run -d -p 8000:5000 --env-file=.env --name 1village 1village_image
sudo docker image prune -f