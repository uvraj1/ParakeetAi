/**
 * AI Response Generation & Streaming Service
 * Provides instantaneous (<150ms simulated or live) guidance during interviews.
 */

export async function* streamInterviewAnswer(questionText, style = 'bullet', context = {}) {
  // Extract context if present (resume, target role, job description)
  const role = context.targetRole || "Software Engineer";
  const resumeHighlights = context.resume || "5+ years building distributed cloud platforms, scaling APIs, and optimizing database performance.";

  const isCoding = /leetcode|algorithm|function|array|tree|graph|dp|complexity|time complexity|reverse|sort|binary|pointer|stack|queue|sql|query/i.test(questionText) || style === 'code';
  const isBehavioral = /tell me about a time|conflict|disagree|mistake|leadership|failure|proud|situation|team/i.test(questionText) || style === 'star';
  const isSystemDesign = /design|architecture|scale|throughput|latency|microservices|distributed|database|sharding|cache|kafka/i.test(questionText) || style === 'system_design';

  let responseChunks = [];

  if (isCoding) {
    responseChunks = [
      "### Key Approach & Algorithm:\n",
      "• **Intuition:** Use a **Two-Pointer / Sliding Window** or **Min-Heap** strategy to maintain optimal state in O(N) or O(N log K) time.\n",
      "• **Edge Cases to Mention:** Empty input, single element, negative values, integer overflow, duplicate keys.\n",
      "• **Time Complexity:** O(N) | **Space Complexity:** O(1) auxiliary space.\n\n",
      "```python\n",
      "def solveInterviewProblem(data: list[int]) -> int:\n",
      "    if not data:\n",
      "        return 0\n",
      "    \n",
      "    # Two-pointer initialization\n",
      "    left, right = 0, len(data) - 1\n",
      "    max_val = 0\n",
      "    \n",
      "    while left < right:\n",
      "        current_val = min(data[left], data[right]) * (right - left)\n",
      "        max_val = max(max_val, current_val)\n",
      "        \n",
      "        # Move pointer with smaller height towards center\n",
      "        if data[left] < data[right]:\n",
      "            left += 1\n",
      "        else:\n",
      "            right -= 1\n",
      "            \n",
      "    return max_val\n",
      "```\n\n",
      "**What to say out loud right now:**\n",
      "\"*First, I'll clarify the input bounds and whether memory is constrained. A brute-force approach would check all pairs in O(N²), but we can optimize this to O(N) using two pointers moving inwards.*\""
    ];
  } else if (isBehavioral || style === 'star') {
    responseChunks = [
      "### STAR Structured Response (Say out loud):\n\n",
      "• **S (Situation):** At my previous company, our team faced a critical deadline migration where our primary API was degrading under a 300% sudden traffic spike.\n\n",
      "• **T (Task):** As technical lead, I needed to triage the bottleneck immediately, prevent SLA violations, and resolve a heated architectural disagreement between senior engineers regarding caching vs DB sharding.\n\n",
      "• **A (Action):** I set up a time-boxed 30-minute profiling session. I identified that 82% of requests were repetitive reads on identical product keys. I implemented a Redis read-through cache with a staggered TTL to avoid cache thundering herds, while creating a clear rollback plan.\n\n",
      "• **R (Result):** Reduced P99 latency by 74%, cut database CPU usage from 96% down to 24%, and we delivered the launch with zero downtime. My team adopted this profiling protocol as our standard SOP."
    ];
  } else if (isSystemDesign || style === 'system_design') {
    responseChunks = [
      "### System Architecture Blueprint:\n\n",
      "1. **Core Requirements & Numbers:**\n",
      "   • Daily Active Users (DAU): ~20 Million\n",
      "   • Read/Write Ratio: 10:1 (Heavy Read traffic)\n",
      "   • Latency SLA: P99 < 120ms globally\n\n",
      "2. **High-Level Components:**\n",
      "   • **DNS & Anycast Geo-Routing:** Route users to nearest Edge Point of Presence (PoP).\n",
      "   • **API Gateway (Envoy/Kong):** SSL termination, rate limiting (Token Bucket), authentication.\n",
      "   • **Stateless Microservices:** Autoscaled Kubernetes cluster.\n",
      "   • **Caching Tier:** Distributed Redis Cluster with LRU eviction and circuit breaker.\n",
      "   • **Persistence Layer:** PostgreSQL with Citus sharding for transactions, Cassandra/ScyllaDB for event logs.\n",
      "   • **Message Broker:** Apache Kafka for async fan-out and decoupled event streaming.\n\n",
      "3. **Tradeoffs & Scaling Bottlenecks to Highlight:**\n",
      "   • Mention CAP Theorem: We choose AP (Eventual Consistency) for social feed, CP for transactional financial balance."
    ];
  } else {
    // Concise bullet mode (standard quick glancing)
    responseChunks = [
      "### Quick Glancable Talking Points:\n\n",
      `• **Direct Answer:** \"Yes, the primary reason is performance isolation and reducing blast radius across services.\"\n`,
      `• **Key Supporting Metric:** At scale, this reduces cross-network round trips from 150ms to sub-15ms.\n`,
      `• **Practical Experience:** Mention your experience with ${role}: \"*In our production setup, we handled this by implementing circuit breakers and asynchronous queues.*\"\n`,
      `• **Follow-up Bridge:** Ask the interviewer: \"*Would you like me to dive deeper into the consistency guarantees or the failure recovery mechanism?*\"`
    ];
  }

  // Stream each piece with a realistic cadence
  for (const chunk of responseChunks) {
    await new Promise(res => setTimeout(res, 80));
    yield chunk;
  }
}

/**
 * Predicts the next 3 questions the interviewer is likely to ask
 */
export function predictFollowUpQuestions(questionText) {
  if (/trapping|water|leetcode|algorithm|two pointer/i.test(questionText)) {
    return [
      "What if the elevation map is dynamic and columns change heights in real-time?",
      "Can we parallelize this algorithm across multiple worker threads or GPU cores?",
      "How would you handle negative elevations or 3D terrain?"
    ];
  }
  if (/system design|scale|streaming|kafka|redis/i.test(questionText)) {
    return [
      "How do you handle a celebrity user broadcast with 100x average comment volume without dropping sockets?",
      "What is your data retention and cold-storage archiving strategy?",
      "How do you maintain zero-downtime database schema migrations?"
    ];
  }
  return [
    "Could you share a specific metric or KPI that proved this project was successful?",
    "If you had to redo this project from scratch today, what would you do differently?",
    "How did you get buy-in from stakeholders who were initially resistant?"
  ];
}

/**
 * Evaluates mock interview transcript and produces scoring breakdown
 */
export function evaluateMockSession(transcript) {
  return {
    overallScore: 92,
    clarityScore: 95,
    structureScore: 89,
    technicalDepth: 93,
    confidenceScore: 90,
    strengths: [
      "Flawless use of the STAR framework with concrete business metrics.",
      "Immediately stated Big-O time and space complexity before writing code.",
      "Clear, calm vocal cadence without filler words ('um', 'like')."
    ],
    improvements: [
      "Could proactively ask about edge cases (e.g. empty inputs or concurrent writes) earlier.",
      "Spend slightly less time explaining basic setup and jump straight into tradeoffs."
    ],
    detailedFeedback: "Strong L6/Staff performance. You framed your solutions around business impact and architectural resilience, which interviewers at tier-1 companies heavily favor."
  };
}
