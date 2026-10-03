package org.example.bookaiapi.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    @Value("\${app.cors.allowed-origins}")
    private val allowedOrigins: String,
) {
    @Bean
    fun passwordEncoder(): BCryptPasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()

        configuration.allowedOrigins =
            allowedOrigins
                .split(",")
                .map(String::trim)
                .filter(String::isNotEmpty)

        // Métodos HTTP permitidos
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")

        // Cabeçalhos aceitos nas requisições (importante para enviar tokens JWT)
        configuration.allowedHeaders = listOf("Authorization", "Content-Type", "Cache-Control")

        // Permite o envio de cookies ou credenciais de autenticação se necessário
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration) // Aplica para todas as rotas
        return source
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers("/", "/error").permitAll()
                it
                    .requestMatchers(
                        HttpMethod.GET,
                        "/index.html",
                        "/assets/**",
                        "/signin",
                        "/signup",
                        "/read",
                        "/auth/login",
                        "/auth/signup",
                        "/sample/**",
                    ).permitAll()
                it.requestMatchers(HttpMethod.POST, "/api/auth/signup", "/api/auth/signin").permitAll()
                it.requestMatchers(HttpMethod.GET, "/api/auth/validate").permitAll()
                it.requestMatchers(HttpMethod.GET, "/api/hello").permitAll()
                it.anyRequest().authenticated()
            }

        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter::class.java,
        )
        return http.build()
    }
}
