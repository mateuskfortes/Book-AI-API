package org.example.bookaiapi.exception

/** Represents a response processing failure from the AI provider. */
class AIServiceException(
    message: String,
) : RuntimeException(message)
