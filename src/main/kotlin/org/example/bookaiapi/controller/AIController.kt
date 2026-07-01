package org.example.bookaiapi.controller

import org.example.bookaiapi.dto.AIExplanationRequest
import org.example.bookaiapi.dto.AIExplanationResponse
import org.example.bookaiapi.service.AIService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/ai")
class AIController(
    private val aiService: AIService
) {
    @PostMapping("/explanation")
    fun explanation(@RequestBody request: AIExplanationRequest): ResponseEntity<AIExplanationResponse> {
        return ResponseEntity(aiService.explanation(request), HttpStatus.OK)
    }
}