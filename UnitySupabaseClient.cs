using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;
using System;

public class UnitySupabaseClient : MonoBehaviour
{
    [Header("Supabase Configuration")]
    [SerializeField] private string supabaseUrl = "YOUR_SUPABASE_URL"; // e.g., "https://your-project.supabase.co"
    [SerializeField] private string supabaseAnonKey = "YOUR_SUPABASE_KEY";

    private string aiActivitiesEndpoint;
    private string leaderboardEndpoint;

    void Awake()
    {
        // Initialize endpoints
        aiActivitiesEndpoint = $"{supabaseUrl}/rest/v1/ai_activities";
        leaderboardEndpoint = $"{supabaseUrl}/rest/v1/leaderboard";
    }

    #region AI Activities
    public void LogAIActivity(string agentId, string action, string details)
    {
        var activityData = new AIActivityData
        {
            agent_id = agentId,
            action = action,
            details = details
        };

        StartCoroutine(PostToSupabase(aiActivitiesEndpoint, JsonUtility.ToJson(activityData)));
    }

    // Example usage:
    // LogAIActivity("agent_001", "move", "Moved to position (10,5,3)");
    #endregion

    #region Leaderboard
    public void SubmitScore(string playerName, int score)
    {
        var scoreData = new LeaderboardData
        {
            player_name = playerName,
            score = score
        };

        StartCoroutine(PostToSupabase(leaderboardEndpoint, JsonUtility.ToJson(scoreData)));
    }

    // Example usage:
    // SubmitScore("Player1", 1000);
    #endregion

    private IEnumerator PostToSupabase(string endpoint, string jsonData)
    {
        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();

            // Set required headers
            request.SetRequestHeader("apikey", supabaseAnonKey);
            request.SetRequestHeader("Authorization", $"Bearer {supabaseAnonKey}");
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Prefer", "return=minimal"); // Don't return the inserted row

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Error posting to Supabase: {request.error}");
                Debug.LogError($"Response: {request.downloadHandler.text}");
            }
            else
            {
                Debug.Log($"Successfully posted to {endpoint.Substring(endpoint.LastIndexOf('/'))}");
            }
        }
    }

    #region Data Classes
    [Serializable]
    private class AIActivityData
    {
        public string agent_id;
        public string action;
        public string details;
    }

    [Serializable]
    private class LeaderboardData
    {
        public string player_name;
        public int score;
    }
    #endregion

    #region Test Methods
    // Test methods to verify connection and data posting
    public void TestAIActivity()
    {
        LogAIActivity(
            $"test_agent_{DateTime.Now.Ticks}", 
            "test_action", 
            $"Test activity at {DateTime.Now.ToLocalTime()}"
        );
    }

    public void TestLeaderboard()
    {
        SubmitScore(
            $"test_player_{DateTime.Now.Ticks}",
            UnityEngine.Random.Range(100, 1000)
        );
    }
    #endregion
}
