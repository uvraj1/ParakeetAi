export const COMPANY_QUESTIONS = [
  {
    id: "goog-1",
    company: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    role: "Senior Software Engineer (L5)",
    category: "Coding & Algorithms",
    frequency: 98,
    difficulty: "Hard",
    title: "Trapping Rain Water II (3D Grid) & Shortest Path with Obstacles",
    question: "Given an m x n integer matrix heightMap representing the height of each unit cell in a 2D elevation map, return the volume of water it can trap after raining. How does this compare with the 1D priority queue Dijkstra approach?",
    tags: ["Graph", "Priority Queue", "BFS", "LeetCode 407"],
    idealAnswer: "We use a Min-Heap (PriorityQueue) along with BFS. First, push all outer boundary cells into the min-heap as water will spill over the borders. Keep a visited matrix. Pop the cell with minimum height. For each unvisited neighbor, the water trapped above it is max(0, current_height - neighbor_height). Then update the neighbor's height in heap to max(neighbor_height, current_height) and push it. Time complexity is O(M * N * log(M * N)), Space O(M * N).",
    codeSnippet: `def trapRainWater(heightMap: list[list[int]]) -> int:
    import heapq
    if not heightMap or not heightMap[0]:
        return 0
    m, n = len(heightMap), len(heightMap[0])
    visited = [[False] * n for _ in range(m)]
    heap = []
    
    # Push border cells into min-heap
    for r in range(m):
        for c in range(n):
            if r == 0 or r == m - 1 or c == 0 or c == n - 1:
                heapq.heappush(heap, (heightMap[r][c], r, c))
                visited[r][c] = True
                
    water = 0
    while heap:
        h, r, c = heapq.heappop(heap)
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:
                visited[nr][nc] = True
                water += max(0, h - heightMap[nr][nc])
                heapq.heappush(heap, (max(h, heightMap[nr][nc]), nr, nc))
    return water`
  },
  {
    id: "meta-1",
    company: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    role: "Staff Engineer (E6)",
    category: "System Design",
    frequency: 95,
    difficulty: "Hard",
    title: "Design a Global Real-time Live Video Streaming & Comment Fan-out System",
    question: "Design Instagram / Facebook Live capable of handling 50 million concurrent viewers on a single celebrity broadcast with sub-second comment sync, adaptive bitrate video ingestion, and high availability.",
    tags: ["Distributed Systems", "WebSockets", "Kafka", "CDN / Edge"],
    idealAnswer: "1. Video Ingestion: RTMP/SRT from host to nearest edge Ingest Server -> Transcoding worker pool into HLS/DASH (multi-bitrate ladders 1080p, 720p, 480p) -> Origin video store -> Global CDN with chunked CMAF transfer.\n2. Chat/Comments: HTTP POST to API Gateway -> Kafka partitioned by stream_id -> Flink/Spark Streaming for rate limiting and spam filtering -> Redis PubSub fanout tree -> WebSocket edge servers with adaptive downsampling when comment volume exceeds 10,000/sec.",
    codeSnippet: null
  },
  {
    id: "amzn-1",
    company: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    role: "Engineering Manager (L6/L7)",
    category: "Behavioral (STAR)",
    frequency: 97,
    difficulty: "Medium",
    title: "Tell me about a time you had to make a critical architectural decision with incomplete data (Bias for Action).",
    question: "Amazon LP: Bias for Action & Have Backbone; Disagree and Commit. Describe a high-stakes scenario where you had to push forward without waiting for full consensus.",
    tags: ["Leadership Principles", "STAR Method", "Bias for Action"],
    idealAnswer: "Situation: At my previous company, our primary database was experiencing write lock saturation during Black Friday week. We were projecting catastrophic failure within 48 hours without historical benchmarks for our experimental sharding prototype.\nTask: As lead architect, I had to choose between a risky 6-hour partition migration or aggressive client-side write buffering with eventual consistency.\nAction: I evaluated the reversible vs irreversible blast radius (Two-Way Door). I opted for write buffering through Redis stream buffers, wrote circuit-breaker failovers, and aligned the VP of Eng within 2 hours.\nResult: Zero downtime across Black Friday, processed $14M in GMV, and the solution became our permanent async ingestion pattern.",
    codeSnippet: null
  },
  {
    id: "st没-1",
    company: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    role: "Backend Engineer",
    category: "Idempotency & Concurrency",
    frequency: 94,
    difficulty: "Hard",
    title: "Design an Exactly-Once Payment Webhook Processing and Retry Engine",
    question: "How do you guarantee exactly-once payment processing across distributed payment gateways when network timeouts happen between the merchant, Stripe, and banking rails?",
    tags: ["Payments", "Idempotency Keys", "Distributed Locks", "ACID"],
    idealAnswer: "Use cryptographically random idempotency keys supplied in the HTTP header (Idempotency-Key). Atomically insert the key into a deduplication table with a processing lock state (TTL 120s). If duplicate request arrives with same payload, return the cached result. If keys match but payload differs, reject with 400 Bad Request. For bank transitions, use a distributed two-phase state machine with outbox pattern to ensure message dispatch only happens if DB transaction commits.",
    codeSnippet: null
  },
  {
    id: "msft-1",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    role: "Principal AI Scientist",
    category: "AI & Machine Learning",
    frequency: 91,
    difficulty: "Hard",
    title: "KV-Cache Optimization & Speculative Decoding for Low-Latency LLM Serving",
    question: "Explain PagedAttention (vLLM style) and how speculative decoding reduces generation latency for conversational models without losing output quality.",
    tags: ["LLM", "Transformers", "CUDA", "vLLM", "Inference"],
    idealAnswer: "Standard Transformer autoregressive generation allocates static contiguous GPU memory for KV-cache causing up to 60-80% memory fragmentation. PagedAttention divides KV cache into fixed-size virtual memory blocks, managed like OS paging tables. Speculative decoding runs a small draft model (e.g. 1B parameter) to propose K candidate tokens in parallel, which the target model (e.g. 70B) verifies in a single forward pass using modified causal masks.",
    codeSnippet: null
  }
];

export const MOCK_INTERVIEWS = [
  {
    id: "mock-google-l5",
    title: "Google L5 Distributed Systems & Coding",
    interviewer: "Sarah Jenkins, Staff SWE @ Google Cloud",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    duration: "45 mins",
    difficulty: "Hard",
    questionsCount: 4,
    focus: ["System Architecture", "Concurrency", "Edge Cases", "Coding Speed"],
    initialPrompt: "Hi there! I'm Sarah, lead architect on Google Cloud Spanner. Today we're going to dive into designing a scalable rate limiter with sub-millisecond precision across multiple regions. Could you start by laying out your functional requirements?"
  },
  {
    id: "mock-meta-behavioral",
    title: "Meta Executive & Behavioral Leadership",
    interviewer: "David Zhang, Director of Engineering @ Meta",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    duration: "35 mins",
    difficulty: "Medium",
    questionsCount: 5,
    focus: ["Conflict Resolution", "Disagreement Handling", "Technical Influence", "STAR Framework"],
    initialPrompt: "Welcome! Tell me about the most contentious technical disagreement you've had with a principal engineer or product partner, and how you navigated it to business success."
  },
  {
    id: "mock-leetcode-live",
    title: "Live Technical Screen (LeetCode Live Run)",
    interviewer: "Alex Rivera, Senior Staff Interviewer @ Stripe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    duration: "40 mins",
    difficulty: "Hard",
    questionsCount: 3,
    focus: ["Algorithmic Optimization", "Big-O Analysis", "Live Debugging"],
    initialPrompt: "We're going to tackle a stream processing problem. You are receiving an infinite stream of integer transactions. We need to find the median at any point in time with O(1) query time. How would you approach this?"
  }
];

export const REVIEWS = [
  {
    id: 1,
    name: "Marcus Vance",
    role: "L6 Staff Engineer at Google",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    content: "ParakeetAI was literally the difference between me freezing on the 3D dynamic programming round and getting a $420k offer. The sub-second answer streaming gave me exactly the bullet points I needed without breaking my eye contact on camera.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    time: "2 weeks ago"
  },
  {
    id: 2,
    name: "Elena Rostova",
    role: "Senior Product Manager at Meta",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    content: "The STAR framework mode is extraordinary. It listened to the interviewer asking a vague leadership question, pulled the exact metric from my uploaded resume, and suggested a polished 3-part answer before I even finished my opening sentence.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    time: "1 month ago"
  },
  {
    id: 3,
    name: "Karan Patel",
    role: "Backend Architect at Amazon AWS",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    content: "The screen-capture LeetCode solver is black magic. I took a snapshot of a gnarly graph traversal problem on CoderPad, and within 1.2 seconds Parakeet broke down the DFS with memoization and edge cases. 100% undetectable.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    time: "3 days ago"
  }
];

export const FAQS = [
  {
    question: "What languages does ParakeetAI support?",
    answer: "ParakeetAI supports real-time transcription and AI generation across 48+ languages including English, Spanish, French, German, Mandarin, Japanese, Hindi, Portuguese, and more, with instant cross-lingual translation."
  },
  {
    question: "Does ParakeetAI support coding calls?",
    answer: "Yes! Full coding support with screen snapping for LeetCode, HackerRank, CoderPad, CodeSignal, and local IDEs. It analyzes problem statements, writes production-ready code in Python, C++, Java, JS/TS, Go, Rust, or SQL, and explains the Time/Space complexity."
  },
  {
    question: "Can I give ParakeetAI instructions to follow during the call?",
    answer: "Absolutely. You can set custom personality guidelines, response length (concise bullet mode vs in-depth STAR explanations), or inject your resume, past projects, and target job description so all answers align with your real experience."
  },
  {
    question: "Is it detectable on Zoom, Google Meet, or Microsoft Teams?",
    answer: "ParakeetAI operates with 100% stealth. It does NOT join as an external bot or record audio through meeting bot integrations. It captures local audio streams and displays an invisible, non-shared floating window that screen-sharing software cannot capture."
  },
  {
    question: "Is ParakeetAI really 100% free to use?",
    answer: "Yes! ParakeetAI is completely free and priceless for every candidate. There are zero paywalls, zero subscription fees, no credit card requirements, and unlimited access to all AI features."
  },
  {
    question: "Which AI models power ParakeetAI?",
    answer: "ParakeetAI runs on ultra-low latency multimodal models including Gemini 2.5 Flash, Claude 3.5 Sonnet, and GPT-4o, fine-tuned specifically for conversational flow, technical interview problems, and real-time guidance."
  }
];

export const PRICING_PLANS = [
  {
    id: "free-forever",
    name: "100% Free Forever",
    tagline: "Unlimited access for all candidates worldwide. Zero paywalls, zero catch.",
    price: "$0",
    billing: "forever free",
    popular: true,
    features: [
      "Unlimited real-time AI interview sessions",
      "Instant sub-second streaming answers (<150ms)",
      "Full coding & screen-snapping solver (LeetCode, HackerRank)",
      "Undetectable stealth floating overlay widget",
      "Unlimited interactive voice Mock Interviews",
      "Complete Company Question Bank (10,000+ questions)",
      "AI Resume tailoring & ATS score scanner",
      "Unlimited AI Studio Headshots"
    ]
  },
  {
    id: "open-source",
    name: "Candidate Champion",
    tagline: "Dedicated to helping every engineer & job seeker land their dream offer.",
    price: "$0",
    billing: "no card needed",
    popular: false,
    features: [
      "100% unrestricted dual audio listening",
      "Real-time STAR behavioral answer generator",
      "Complete System Design architectural blueprints",
      "Automatic post-interview debrief & thank-you email drafts",
      "Document vault for unlimited resume uploads",
      "Community-driven interview updates"
    ]
  },
  {
    id: "students-jobseekers",
    name: "Students & New Grads",
    tagline: "Zero cost barrier so everyone has an equal shot at top tech careers.",
    price: "$0",
    billing: "lifetime free",
    popular: false,
    features: [
      "Full LeetCode algorithm problem recognition",
      "Big-O time & space complexity breakdowns",
      "Mock interviews with senior FAANG interviewer personas",
      "AI resume impact bullet point rewriter",
      "Instant copy & stealth keyboard shortcuts"
    ]
  }
];
