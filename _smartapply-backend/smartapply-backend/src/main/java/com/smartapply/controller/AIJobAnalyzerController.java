
package com.smartapply.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartapply.service.AIJobAnalyzerService;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/analyzer")
@CrossOrigin(origins = "http://localhost:5173")
public class AIJobAnalyzerController {

    private final AIJobAnalyzerService aiJobAnalyzerService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIJobAnalyzerController(
            AIJobAnalyzerService aiJobAnalyzerService) {

        this.aiJobAnalyzerService = aiJobAnalyzerService;
    }

    // Existing AI Job Analyzer API
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, String>> analyzeJob(
            @RequestBody Map<String, String> request) {

        String jobDescription = request.get("jobDescription");

        if (jobDescription == null || jobDescription.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Please enter a job description.")
            );
        }

        String analysis =
                aiJobAnalyzerService.analyzeJobDescription(jobDescription);

        return ResponseEntity.ok(
                Map.of("analysis", analysis)
        );
    }

    // AI Interview Questions API for Practice Mode
    @PostMapping("/interview-questions")
    public ResponseEntity<?> generateInterviewQuestions(
            @RequestBody Map<String, String> request) {

        String topic = request.get("topic");

        if (topic == null || topic.isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Please select or enter a topic.")
            );
        }

        try {

            String questions =
                    aiJobAnalyzerService.generateInterviewQuestions(topic);

            // Convert JSON string into actual JSON data
            JsonNode questionData = objectMapper.readTree(questions);

            return ResponseEntity.ok(questionData);

        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(
                    Map.of(
                            "error",
                            "Could not generate interview questions: "
                                    + e.getMessage()
                    )
            );
        }
    }
}


