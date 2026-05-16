window.AAIF_TAXONOMY = [
  {
    "term": "Agent derailment",
    "category": "Agentic Threats",
    "definition": "An unintended deviation in an AI agent's behavior that causes it to pursue goals or take actions outside its intended scope, without malicious external cause.",
    "notes": "Raised during discussion of non-malicious agent misbehavior (2026-03-03). Distinct from adversarial attacks.",
    "workgroups": ["Security & Privacy WG", "Accuracy & Reliability WG"]
  },
  {
    "term": "Agent identity",
    "category": "Identity & Authorization",
    "definition": "A verifiable identifier assigned to an AI agent that distinguishes it from other agents and human users within a system.",
    "notes": "Samantha Coyle raised agent-to-agent and agent-to-MCP-server authentication (2026-02-17).",
    "workgroups": ["Identity & Trust WG", "Security & Privacy WG"]
  },
  {
    "term": "Agent sabotage",
    "category": "Agentic Threats",
    "definition": "Deliberate manipulation of an AI agent's behavior by an external party, causing it to act against its intended purpose.",
    "notes": "Discussed alongside derailment as an edge case between security and reliability (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Accuracy & Reliability WG"]
  },
  {
    "term": "Agentic AI",
    "category": "Infrastructure & Architecture",
    "definition": "AI systems composed of one or more autonomous agents that can perceive their environment, make decisions, invoke tools, and take actions with limited or no human intervention.",
    "notes": "Foundational term for the working group; used throughout all meetings.",
    "workgroups": ["All Working Groups"]
  },
  {
    "term": "Autonomous",
    "category": "Agentic Controls",
    "definition": "A mode or design pattern in which an agent can operate and take actions to some extent without explicit permission from the agent user. The agent interprets a prompt or request and performs one or more actions to carry it out — for example, finding, negotiating, and completing a purchase on a user's behalf.",
    "notes": "Defined during taxonomy review (2026-03-17).",
    "workgroups": ["Workflows & Process Integration WG", "Security & Privacy WG"]
  },
  {
    "term": "Blast radius",
    "category": "Agentic Threats",
    "definition": "The scope and extent of damage or data exposure that can result from a compromised, misconfigured, or rogue agent.",
    "notes": "Samantha Coyle raised this in the context of protecting data from rogue agents (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Governance, Risk & Regulatory Alignment WG"]
  },
  {
    "term": "Delegated authorization",
    "category": "Identity & Authorization",
    "definition": "A mechanism by which a human or system grants an AI agent a scoped set of permissions to act on its behalf, typically with constraints on what actions the agent may perform.",
    "notes": "Discussed alongside capability-based auth and tool invocation restrictions (2026-02-17).",
    "workgroups": ["Identity & Trust WG", "Security & Privacy WG"]
  },
  {
    "term": "Deterministic policies",
    "category": "Agentic Controls",
    "definition": "Policies that constrain an autonomous agent's actions in a way that cannot be overridden or misinterpreted by the AI agent. These policies are enforced outside the AI inference process, preventing the agent from taking certain actions — for example, an agent SDK policy that blocks access to a tool.",
    "notes": "Defined during taxonomy review (2026-03-17).",
    "workgroups": ["Security & Privacy WG", "Governance, Risk & Regulatory Alignment WG"]
  },
  {
    "term": "Hooks and checkpoints",
    "category": "Security Practices",
    "definition": "Standardized interception points in an agentic AI platform's execution pipeline where security controls, logging, or policy enforcement can be applied.",
    "notes": "Bar Kaduri proposed hooks and checkpointing standards (2026-02-17).",
    "workgroups": ["Security & Privacy WG", "Observability & Traceability WG"]
  },
  {
    "term": "Human in the loop (HITL)",
    "category": "Agentic Controls",
    "definition": "A design pattern in which a human must review, approve, or intervene in an AI agent's actions at defined checkpoints before the agent may proceed.",
    "notes": "Identified as a key consideration during the initial brainstorm (2026-02-17).",
    "workgroups": ["Workflows & Process Integration WG", "Security & Privacy WG"]
  },
  {
    "term": "Multi-agent persuasion",
    "category": "Agentic Threats",
    "definition": "The risk that one AI agent manipulates or unduly influences another agent's decision-making through adversarial or misleading communication.",
    "notes": "Brainstormed as a mitigation area (2026-02-17).",
    "workgroups": ["Security & Privacy WG"]
  },
  {
    "term": "PII obfuscation",
    "category": "Data and Privacy",
    "definition": "Techniques for masking, redacting, or transforming personally identifiable information so that it cannot be recovered or linked to an individual during agent processing.",
    "notes": "Listed as a brainstorm topic (2026-02-17) and folded into Theme D (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Governance, Risk & Regulatory Alignment WG"]
  },
  {
    "term": "Privacy-preserving execution",
    "category": "Data and Privacy",
    "definition": "Patterns in which an AI agent can operate on encrypted or protected data without exposing the underlying content, using techniques such as zero-knowledge proofs or trusted execution environments.",
    "notes": "Ty described ZK-proof patterns; Tony Douglas cited TEEs and encrypted vector databases (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Identity & Trust WG"]
  },
  {
    "term": "Prompt injection",
    "category": "Security Practices",
    "definition": "An attack in which an adversary crafts input that causes an AI agent to override its instructions, bypass safeguards, or execute unintended actions.",
    "notes": "Identified as a mitigation area during ideation (2026-02-17).",
    "workgroups": ["Security & Privacy WG"]
  },
  {
    "term": "Protected data",
    "category": "Data and Privacy",
    "definition": "Information subject to regulatory or contractual protections (e.g., HIPAA, GDPR), which may include health records, financial data, or other categories that AI agents must handle with specific safeguards.",
    "notes": "Tom Sheffler raised whether AI agents introduce new categories of protected data (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Governance, Risk & Regulatory Alignment WG"]
  },
  {
    "term": "Red teaming",
    "category": "Security Practices",
    "definition": "Structured adversarial testing of AI systems in which testers simulate attacks to identify vulnerabilities, failure modes, and security gaps.",
    "notes": "Listed as a brainstorm topic under pen testing and red teaming best practices (2026-02-17).",
    "workgroups": ["Security & Privacy WG", "Accuracy & Reliability WG"]
  },
  {
    "term": "Rogue agent",
    "category": "Agentic Threats",
    "definition": "An AI agent that operates outside its authorized boundaries, whether due to compromise, misconfiguration, or emergent behavior.",
    "notes": "Used in discussion of blast radius and data protection (2026-03-03).",
    "workgroups": ["Security & Privacy WG"]
  },
  {
    "term": "Secrets",
    "category": "Data and Privacy",
    "definition": "Traditional credentials and cryptographic material — such as API keys, tokens, passwords, and environment variables — that grant access to systems or services.",
    "notes": "Distinguished from the broader \"sensitive data\" during terminology discussion. Ofek Dadush raised secrets management; David Deng proposed the narrower scope (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Identity & Trust WG"]
  },
  {
    "term": "Sensitive data",
    "category": "Data and Privacy",
    "definition": "An umbrella term encompassing secrets, PII, proprietary information, and any data whose exposure would cause harm. Preferred over the narrower term \"secrets\" when the intent is to cover all confidential data categories.",
    "notes": "The group debated \"secrets\" vs. \"sensitive data\" and converged on \"sensitive data\" as the broader, less ambiguous term (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Governance, Risk & Regulatory Alignment WG"]
  },
  {
    "term": "Trusted execution environment (TEE)",
    "category": "Infrastructure & Architecture",
    "definition": "A secure, hardware-isolated area of a processor that ensures code and data loaded inside are protected from the rest of the system, including the operating system.",
    "notes": "Tony Douglas cited TEE work in the context of privacy-preserving agent workflows (2026-03-03).",
    "workgroups": ["Security & Privacy WG", "Identity & Trust WG"]
  },
  {
    "term": "Typo squatting",
    "category": "Agentic Threats",
    "definition": "A supply chain attack in which an adversary publishes a malicious server package with a name resembling a legitimate one, hoping users will install it by mistake.",
    "notes": "Raised as a supply chain risk to agentic systems (2026-03-17).",
    "workgroups": ["Security & Privacy WG", "Accuracy & Reliability WG"]
  },
  {
    "term": "Zero-knowledge proof (ZKP)",
    "category": "Infrastructure & Architecture",
    "definition": "A cryptographic method by which one party can prove to another that a statement is true without revealing any information beyond the validity of the statement itself.",
    "notes": "Ty described ZKP patterns where agents return only boolean results to prevent data leakage (2026-03-03).",
    "workgroups": ["Security & Privacy WG"]
  }
];
