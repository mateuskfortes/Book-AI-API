package org.example.bookaiapi.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class AuthPageController {

    @GetMapping("/signin")
    fun signin(): String {
        return "auth/login"
    }

    @GetMapping("/signup")
    fun signup(): String {
        return "auth/signup"
    }

    @GetMapping("/auth/login")
    fun legacySignin(): String {
        return "redirect:/signin"
    }

    @GetMapping("/auth/signup")
    fun legacySignup(): String {
        return "redirect:/signup"
    }
}
