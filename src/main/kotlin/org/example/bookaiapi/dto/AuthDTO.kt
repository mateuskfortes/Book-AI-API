package org.example.bookaiapi.dto

data class SignUpRequest(
    val email: String,
    val password: String
)

data class SignInRequest(
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String,
    val email: String,
    val userId: Long
)
