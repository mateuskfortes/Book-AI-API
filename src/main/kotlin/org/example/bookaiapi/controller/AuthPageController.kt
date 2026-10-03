package org.example.bookaiapi.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
@Suppress("FunctionOnlyReturningConstant")
class AuthPageController {
    @GetMapping("/signin")
    fun signin(): String = "forward:/index.html"

    @GetMapping("/signup")
    fun signup(): String = "forward:/index.html"

    @GetMapping("/read")
    fun read(): String = "forward:/index.html"

    @GetMapping("/")
    fun root(): String = "redirect:/signin"

    @GetMapping("/auth/login")
    fun legacySignin(): String = "redirect:/signin"

    @GetMapping("/auth/signup")
    fun legacySignup(): String = "redirect:/signup"
}
