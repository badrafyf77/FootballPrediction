---
title: Football Prediction API
emoji: ⚽
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# Football Prediction API

A FastAPI application that predicts football match outcomes using machine learning models.

## Features

- Predicts match scores, winners, and probabilities
- Supports multiple leagues
- RESTful API with automatic documentation
- Docker + Kubernetes

## API Usage

Send a POST request to `/api/predict` with match data to get predictions.

The API automatically generates interactive documentation at `/docs` when running.

## Model Source Configuration

If local files in `models/` are Git LFS pointers instead of binaries, set `MODEL_BASE_URL`
to a model host URL that serves `*.pkl` files.
