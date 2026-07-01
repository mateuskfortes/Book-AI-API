package org.example.bookaiapi.exception

class UserAlreadyExistsException(message: String) : RuntimeException(message)
class InvalidCredentialsException(message: String) : RuntimeException(message)
class UserNotFoundException(message: String) : RuntimeException(message)
