package org.example.bookaiapi.dto

data class AIExplanationRequest (
    val question: String
)

data class AIExplanationResponse (
    val explanation: String
)

data class GeminiResponse(
    val id: String,
    val status: String,
    val model: String,
    val steps: List<Step>
)

data class Step(
    val type: String,
    val content: List<Content>? = null
)

data class Content(
    val text: String,
    val type: String
)