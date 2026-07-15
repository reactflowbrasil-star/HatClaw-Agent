using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace WebApp.Api.Services;

public class TopoClawService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TopoClawService> _logger;
    private readonly string _baseUrl;

    public TopoClawService(HttpClient httpClient, ILogger<TopoClawService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _baseUrl = configuration["TOPOCLAW_URL"] ?? "http://localhost:18790";
    }

    public async Task<JsonElement> ListSkillsAsync(CancellationToken ct = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/skills", ct);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to list TopoClaw skills");
            throw;
        }
    }

    public async Task<JsonElement> ExecuteSkillAsync(string skillName, object payload, CancellationToken ct = default)
    {
        // This assumes TopoClaw has a way to execute a skill via API.
        // Based on my research, topoclaw has a /chat endpoint that can trigger skills.
        // Or we might need to add a specific skill execution endpoint to TopoClaw.

        var chatRequest = new
        {
            message = $"Execute skill {skillName} with payload {JsonSerializer.Serialize(payload)}",
            thread_id = Guid.NewGuid().ToString()
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/chat", chatRequest, ct);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to execute TopoClaw skill {SkillName}", skillName);
            throw;
        }
    }

    public async Task<bool> IsHealthyAsync(CancellationToken ct = default)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/health", ct);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }
}
