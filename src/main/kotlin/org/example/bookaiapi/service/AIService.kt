package org.example.bookaiapi.service

import org.example.bookaiapi.dto.AIExplanationRequest
import org.example.bookaiapi.dto.AIExplanationResponse
import org.example.bookaiapi.dto.GeminiResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestClient

@Service
class AIService(
    @Value("\${gemini.api-key}")
    private val apiKey: String,
    @Value("\${gemini.explanation-model}")
    private val explanationAIModel: String,

    private val restClientBuilder: RestClient.Builder
) {
    private val client = restClientBuilder
        .baseUrl("https://generativelanguage.googleapis.com/v1beta")
        .build()

    fun explanation(request: AIExplanationRequest): AIExplanationResponse {
        val question = request.question

        val response = client.post()
            .uri("/interactions")
            .header("x-goog-api-key", apiKey)
            .body(
                mapOf(
                    "model" to explanationAIModel,
                    "input" to question
                )
            )
            .retrieve()
            .body(GeminiResponse::class.java)
            ?: throw RuntimeException("Empty response from Gemini")

        val explanation = response.steps
            .firstOrNull { it.type == "model_output" }
            ?.content
            ?.firstOrNull()
            ?.text
            ?: throw RuntimeException("No model output")

        return AIExplanationResponse(
            explanation = explanation,
        )
    }
}