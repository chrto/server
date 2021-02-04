#!/bin/sh
sqlite3 ./storage/database.sqlite ".read ./storage/sql/tables.sql"
sqlite3 ./storage/database.sqlite ".read ./storage/sql/seeds.sql"
