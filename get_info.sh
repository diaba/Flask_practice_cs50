#! /bin/bash

line ="--------------------------------"

echo "Start at: $(date)"; echo $line
echo $line
echo "UPTIME" ; uptime; echo $line

echo "FREE" ; free; echo $line

echo "WHO" ; who; echo $line

echo "Finishing at: $(date)"
