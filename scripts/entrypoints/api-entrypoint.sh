#!/usr/bin/env bash
set -e
./scripts/wait-for.sh mongo:27017 -- echo "Mongo is up"
# Precompile bootsnap cache safely; run migrations if using any SQL later (noop for Mongoid)
bundle exec puma -C config/puma.rb
