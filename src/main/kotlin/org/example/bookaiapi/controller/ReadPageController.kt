package org.example.bookaiapi.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class ReadPageController {

    @GetMapping("/read")
    fun read(): String {
        return "read/index"
    }
}
