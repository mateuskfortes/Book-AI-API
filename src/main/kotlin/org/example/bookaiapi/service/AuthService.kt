package org.example.bookaiapi.service

import org.example.bookaiapi.dto.SignUpRequest
import org.example.bookaiapi.dto.SignInRequest
import org.example.bookaiapi.dto.AuthResponse
import org.example.bookaiapi.entity.User
import org.example.bookaiapi.exception.InvalidCredentialsException
import org.example.bookaiapi.exception.UserAlreadyExistsException
import org.example.bookaiapi.repository.UserRepository
import org.example.bookaiapi.security.JwtTokenProvider
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val jwtTokenProvider: JwtTokenProvider,
    private val passwordEncoder: BCryptPasswordEncoder,
) {

    fun signUp(request: SignUpRequest): AuthResponse {
        if (userRepository.findByEmail(request.email) != null) {
            throw UserAlreadyExistsException("Email already registered")
        }

        val user = User(
            email = request.email,
            password = passwordEncoder.encode(request.password)!!
        )

        val savedUser = userRepository.save(user)
        val token = jwtTokenProvider.generateToken(savedUser.id, savedUser.email)

        return AuthResponse(
            token = token,
            email = savedUser.email,
            userId = savedUser.id
        )
    }

    fun signIn(request: SignInRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw InvalidCredentialsException("Invalid email or password")

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw InvalidCredentialsException("Invalid email or password")
        }

        val token = jwtTokenProvider.generateToken(user.id, user.email)

        return AuthResponse(
            token = token,
            email = user.email,
            userId = user.id
        )
    }

    fun validateToken(token: String): Boolean {
        return jwtTokenProvider.validateToken(token)
    }

    fun getUserIdFromToken(token: String): Long {
        return jwtTokenProvider.getUserIdFromToken(token)
    }
}
