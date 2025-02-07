using UnityEngine;

public class UnitySupabaseClientExample : MonoBehaviour
{
    private UnitySupabaseClient supabaseClient;

    void Start()
    {
        supabaseClient = GetComponent<UnitySupabaseClient>();
    }

    // Example of logging AI behavior
    void LogAIBehavior()
    {
        supabaseClient.LogAIActivity(
            "agent_001",
            "pathfinding",
            "Found path to target at (10, 0, 5)"
        );
    }

    // Example of submitting a player score
    void SubmitPlayerScore()
    {
        supabaseClient.SubmitScore("Player1", 1000);
    }

    // Example of using the test methods
    void RunTests()
    {
        supabaseClient.TestAIActivity();
        supabaseClient.TestLeaderboard();
    }
}
