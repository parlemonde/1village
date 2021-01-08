#!/bin/bash
docker build . -t 1village_image
docker save 1village_image | ssh -C -i $SSH_KEY_PATH $server sudo docker load
ssh -i $SSH_KEY_PATH $server 'bash -s' < deploy.sh