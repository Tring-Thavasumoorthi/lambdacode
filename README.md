# Memomatic AI SDK Lambda

This repository contains the implementation of a Lambda function using the AI SDK. The purpose of this repo is to integrate and utilize the AI SDK in a serverless environment.

## Features

- Integration with AI SDK.
- Serverless architecture using AWS Lambda.
- Lightweight and scalable solution for AI-powered tasks.

## Parameters

| Name             | Type    | Description                                                 |
| ---------------- | ------- | ----------------------------------------------------------- |
| `x-api-key`      | string  | API key used for authentication (In headers)                |
| `provider`       | string  | The AI provider (`openai`, `gemini`, etc.)                  |
| `model`          | string  | The model to use (`gpt-4o-mini`, `gemini-2.0-flash`, etc.)  |
| `systemPrompt`   | string  | A predefined system-level prompt to guide the AI's behavior |
| `prompt`         | string  | Your input prompt                                           |
| `bucketName`     | string  | S3 bucket name (used if storing/retrieving context)         |
| `key`            | string  | Object key in the S3 bucket                                 |
| `isConversation` | boolean | Enables conversational context if set to `true`             |
| `webSearch`      | boolean | Enables AI to fetch recent data from web search if `true`   |
