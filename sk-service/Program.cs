using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var services = builder.Services;

services.AddSingleton<ChatCoordinator>();

var app = builder.Build();
var runs = new ConcurrentDictionary<string, Task<string>>();

app.MapPost("/assistants/{assistantId}/invoke", async (string assistantId, HttpContext context, ChatCoordinator coord) =>
{
    var payload = await context.Request.ReadFromJsonAsync<MessagePayload>();
    if (payload == null) return Results.BadRequest();
    var runId = Guid.NewGuid().ToString();
    runs[runId] = coord.ProcessAsync(payload.Messages);
    return Results.Ok(new { run_id = runId });
});

app.MapGet("/assistants/{assistantId}/runs/{runId}/events", async (string assistantId, string runId, HttpContext context) =>
{
    context.Response.Headers.Add("Content-Type", "text/event-stream");
    if (runs.TryRemove(runId, out var task))
    {
        var result = await task;
        await context.Response.WriteAsync($"data: {result}\n\n");
    }
    await context.Response.WriteAsync("data: [DONE]\n\n");
});

app.Run();

record MessagePayload(List<ChatMessage> Messages);

class ChatCoordinator
{
    private readonly ChatCompletionService _completion;
    public ChatCoordinator(IConfiguration config)
    {
        var openAiKey = config["OPENAI_API_KEY"] ?? string.Empty;
        var builder = Kernel.CreateBuilder();
        builder.AddOpenAIChatCompletion("gpt-4o", openAiKey);
        var kernel = builder.Build();
        _completion = kernel.GetRequiredService<ChatCompletionService>();
    }

    public async Task<string> ProcessAsync(List<ChatMessage> messages)
    {
        var history = new ChatHistory();
        foreach (var msg in messages)
        {
            history.AddMessage(msg.Role, msg.Content);
        }
        history.AddUserMessage("Respond with helpful product or troubleshooting guidance as needed.");
        var result = await _completion.GetChatMessageContentAsync(history);
        return result.Content;
    }
}
