#!/bin/bash

for ((i=1; i<=50; i++))
do
  message="Hello world $i"
  subject="My Subject $i"

  aws sns publish \
    --subject "$subject" \
    --message "$message" \
    --topic-arn "<topic-arn>" \
    --profile <profile>

  echo "Published message $i"
done
