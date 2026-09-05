package org.pmv.backend.modules.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class PingController {
    @GetMapping("/ping")
    public String ping () {
        return "pong";
    }
}
