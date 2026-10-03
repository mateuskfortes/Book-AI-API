package org.example.bookaiapi.controller

import org.example.bookaiapi.dto.AuthResponse
import org.example.bookaiapi.dto.SignInRequest
import org.example.bookaiapi.dto.SignUpRequest
import org.example.bookaiapi.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/signup")
    fun signUp(
        @RequestBody request: SignUpRequest,
    ): ResponseEntity<AuthResponse> = ResponseEntity(authService.signUp(request), HttpStatus.CREATED)

    @PostMapping("/signin")
    fun signIn(
        @RequestBody request: SignInRequest,
    ): ResponseEntity<AuthResponse> = ResponseEntity(authService.signIn(request), HttpStatus.OK)

    @GetMapping("/validate")
    fun validateToken(
        @RequestHeader("Authorization") token: String,
    ): ResponseEntity<Map<String, Boolean>> {
        val cleanToken = token.replace("Bearer ", "")
        val isValid = authService.validateToken(cleanToken)
        return ResponseEntity(mapOf("valid" to isValid), HttpStatus.OK)
    }
}
