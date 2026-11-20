
package com.smartapply.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class AIJobAnalyzerService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    // AI Job Description Analyzer
    public String analyzeJobDescription(String jobDescription) {

        if (jobDescription == null || jobDescription.isBlank()) {
            throw new RuntimeException(
                    "Please enter a job description."
            );
        }

        String prompt = """
                You are an expert job description analyzer.

                Analyze this job description for a fresher Java Developer.

                Identify:
                1. Required technical skills
                2. Important resume keywords
                3. Experience requirements
                4. Required programming languages
                5. Frameworks and databases
                6. Skills a fresher should learn
                7. Interview preparation topics
                8. Resume improvement suggestions

                Explain everything in simple English.
                Use clear headings and bullet points.

                Job Description:
                """ + jobDescription;

        return callGemini(prompt);
    }

    // AI Interview Questions Generator
    public String generateInterviewQuestions(String topic) {

        if (topic == null || topic.isBlank()) {
            throw new RuntimeException(
                    "Please select or enter a topic."
            );
        }

        String prompt = """
                You are an experienced technical interviewer
                helping freshers prepare for software developer interviews.

                Generate exactly 10 important interview questions about:
                """ + topic + """

                Return ONLY valid JSON.
                Do not use Markdown.
                Do not use code fences.
                Do not add any explanation outside the JSON.

                Follow this exact JSON structure:

                {
                  "topic": "Topic name",
                  "questions": [
                    {
                      "question": "Write the interview question here",
                      "answer": "Explain the correct answer in simple English",
                      "example": "Give a practical example where useful",
                      "followUp": "Write one possible follow-up question"
                    }
                  ]
                }

                Requirements:
                1. Generate exactly 10 questions.
                2. Start with basic questions and gradually increase difficulty.
                3. Target audience: Fresher / Entry-Level Java Developer.
                4. Answers must be correct and easy to understand.
                5. Include practical examples where useful.
                6. Include one follow-up question for every question.
                7. Every question must have all four fields.
                8. Return valid JSON with double quotes.
                """;

        String result = callGemini(prompt);

        // Remove possible Markdown code fences
        result = result.trim();

        if (result.startsWith("```")) {
            result = result.replaceFirst("^```(?:json)?\\s*", "");
            result = result.replaceFirst("\\s*```$", "");
        }

        // Extract JSON object
        int start = result.indexOf("{");
        int end = result.lastIndexOf("}");

        if (start == -1 || end == -1 || end <= start) {
            throw new RuntimeException(
                    "Gemini did not return valid interview question JSON."
            );
        }

        result = result.substring(start, end + 1);

        // Validate JSON
        try {
            JsonNode json = objectMapper.readTree(result);

            if (!json.path("questions").isArray()
                    || json.path("questions").isEmpty()) {

                throw new RuntimeException(
                        "No interview questions were generated."
                );
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Could not process interview questions: "
                            + getErrorMessage(e),
                    e
            );
        }

        return result;
    }

    // Common Gemini API method
    private String callGemini(String prompt) {

        try {

            // Read API key from environment variable
            String apiKey = System.getenv("GEMINI_API_KEY");

            if (apiKey == null || apiKey.isBlank()) {
                throw new RuntimeException(
                        "Gemini API key not found. Check GEMINI_API_KEY."
                );
            }

            // Prepare request body
            Map<String, Object> requestBody = new LinkedHashMap<>();

            requestBody.put("model", "gemini-3.5-flash-lite");
            requestBody.put("input", prompt);
            requestBody.put("store", false);

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            String apiUrl =
                    "https://generativelanguage.googleapis.com/v1beta/interactions";

            // Build HTTP request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("x-goog-api-key", apiKey)
                    .timeout(Duration.ofSeconds(60))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            // Send request
            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            // Check HTTP status
            if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                throw new RuntimeException(
                        "Gemini API error (HTTP "
                                + response.statusCode()
                                + "): "
                                + response.body()
                );
            }

            // Read Gemini response
            JsonNode root = objectMapper.readTree(response.body());

            JsonNode steps = root.path("steps");

            if (steps.isArray()) {

                for (JsonNode step : steps) {

                    if ("model_output".equals(
                            step.path("type").asText())) {

                        JsonNode content = step.path("content");

                        if (content.isArray()) {

                            for (JsonNode item : content) {

                                if ("text".equals(
                                        item.path("type").asText())) {

                                    String result =
                                            item.path("text").asText("");

                                    if (!result.isBlank()) {
                                        return result;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            throw new RuntimeException(
                    "Gemini returned no text response."
            );

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            System.err.println(
                    "Gemini request was interrupted."
            );

            throw new RuntimeException(
                    "Gemini request was interrupted.",
                    e
            );

        } catch (Exception e) {

            String errorMessage = getErrorMessage(e);

            System.err.println(
                    "Gemini API Error Type: "
                            + e.getClass().getName()
            );

            System.err.println(
                    "Gemini API Error Details: "
                            + errorMessage
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Gemini API request failed: " + errorMessage,
                    e
            );
        }
    }

    // Helper method for meaningful error messages
    private String getErrorMessage(Exception e) {

        String message = e.getMessage();

        if (message == null || message.isBlank()) {
            return e.getClass().getSimpleName();
        }

        return message;
    }
}





