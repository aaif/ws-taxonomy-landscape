window.AAIF_TAXONOMY = [
  {
    "term": "Agent derailment",
    "category": "Agentic Threats",
    "aliases": ["Goal drift", "Misalignment"],
    "broaderTerm": "Agentic Misbehavior",
    "definition": "An unintended deviation in an AI agent's behavior that causes it to pursue goals or take actions outside its intended scope, without malicious external cause.",
    "scopeNote": "Raised during discussion of non-malicious agent misbehavior (2026-03-03). Distinct from adversarial attacks.",
    "workgroups": ["Security & Privacy", "Accuracy & Reliability"]
  },
  {
    "term": "Agent identity",
    "category": "Identity & Authorization",
    "aliases": [],
    "broaderTerm": null,
    "definition": "A verifiable identifier assigned to an AI agent that distinguishes it from other agents and human users within a system.",
    "scopeNote": "Samantha Coyle raised agent-to-agent and agent-to-MCP-server authentication (2026-02-17).",
    "workgroups": ["Identity & Trust", "Security & Privacy"]
  },
  {
    "term": "Agent sabotage",
    "category": "Agentic Threats",
    "aliases": ["External agent manipulation"],
    "broaderTerm": "Agentic Misbehavior",
    "definition": "Deliberate manipulation of an AI agent's behavior by an external party, causing it to act against its intended purpose.",
    "scopeNote": "Discussed alongside derailment as an edge case between security and reliability (2026-03-03).",
    "workgroups": ["Security & Privacy", "Accuracy & Reliability"]
  },
  {
    "term": "Agentic AI",
    "category": "Infrastructure & Architecture",
    "aliases": ["Agentic systems"],
    "broaderTerm": null,
    "definition": "AI systems composed of one or more autonomous agents that can perceive their environment, make decisions, invoke tools, and take actions with limited or no human intervention.",
    "scopeNote": "Foundational term for the working group; used throughout all meetings.",
    "workgroups": ["All Working Groups"]
  },
  {
    "term": "Autonomous",
    "category": "Agentic Controls",
    "aliases": ["Fully autonomous operation"],
    "broaderTerm": null,
    "definition": "A mode or design pattern in which an agent can operate and take actions to some extent without explicit permission from the agent user. The agent interprets a prompt or request and performs one or more actions to carry it out — for example, finding, negotiating, and completing a purchase on a user's behalf.",
    "scopeNote": "Defined during taxonomy review (2026-03-17).",
    "workgroups": ["Workflows & Process Integration", "Security & Privacy"]
  },
  {
    "term": "Blast radius",
    "category": "Agentic Threats",
    "aliases": ["Containment scope", "Impact radius"],
    "broaderTerm": null,
    "definition": "The scope and extent of damage or data exposure that can result from a compromised, misconfigured, or rogue agent.",
    "scopeNote": "Samantha Coyle raised this in the context of protecting data from rogue agents (2026-03-03).",
    "workgroups": ["Security & Privacy", "Governance, Risk & Regulatory Alignment"]
  },
  {
    "term": "Delegated authorization",
    "category": "Identity & Authorization",
    "aliases": ["Scoped agent permissions"],
    "broaderTerm": null,
    "definition": "A mechanism by which a human or system grants an AI agent a scoped set of permissions to act on its behalf, typically with constraints on what actions the agent may perform.",
    "scopeNote": "Discussed alongside capability-based auth and tool invocation restrictions (2026-02-17).",
    "workgroups": ["Identity & Trust", "Security & Privacy"]
  },
  {
    "term": "Deterministic policies",
    "category": "Agentic Controls",
    "aliases": ["Hard guardrails", "SDK-enforced rules"],
    "broaderTerm": null,
    "definition": "Policies that constrain an autonomous agent's actions in a way that cannot be overridden or misinterpreted by the AI agent. These policies are enforced outside the AI inference process, preventing the agent from taking certain actions — for example, an agent SDK policy that blocks access to a tool.",
    "scopeNote": "Defined during taxonomy review (2026-03-17).",
    "workgroups": ["Security & Privacy", "Governance, Risk & Regulatory Alignment"]
  },
  {
    "term": "Hooks and checkpoints",
    "category": "Security Practices",
    "aliases": ["Interception points", "Execution middleware"],
    "broaderTerm": null,
    "definition": "Standardized interception points in an agentic AI platform's execution pipeline where security controls, logging, or policy enforcement can be applied.",
    "scopeNote": "Bar Kaduri proposed hooks and checkpointing standards (2026-02-17).",
    "workgroups": ["Security & Privacy", "Observability & Traceability"]
  },
  {
    "term": "Human in the loop (HITL)",
    "category": "Agentic Controls",
    "aliases": ["HITL", "Human oversight"],
    "broaderTerm": null,
    "definition": "A design pattern in which a human must review, approve, or intervene in an AI agent's actions at defined checkpoints before the agent may proceed.",
    "scopeNote": "Identified as a key consideration during the initial brainstorm (2026-02-17).",
    "workgroups": ["Workflows & Process Integration", "Security & Privacy"]
  },
  {
    "term": "Multi-agent persuasion",
    "category": "Agentic Threats",
    "aliases": ["Agent-to-agent social engineering"],
    "broaderTerm": null,
    "definition": "The risk that one AI agent manipulates or unduly influences another agent's decision-making through adversarial or misleading communication.",
    "scopeNote": "Brainstormed as a mitigation area (2026-02-17).",
    "workgroups": ["Security & Privacy"]
  },
  {
    "term": "PII obfuscation",
    "category": "Data and Privacy",
    "aliases": ["Data masking", "PII redaction"],
    "broaderTerm": "Protected data",
    "definition": "Techniques for masking, redacting, or transforming personally identifiable information so that it cannot be recovered or linked to an individual during agent processing.",
    "scopeNote": "Listed as a brainstorm topic (2026-02-17) and folded into Theme D (2026-03-03).",
    "workgroups": ["Security & Privacy", "Governance, Risk & Regulatory Alignment"]
  },
  {
    "term": "Privacy-preserving execution",
    "category": "Data and Privacy",
    "aliases": ["Confidential agent computing"],
    "broaderTerm": null,
    "definition": "Patterns in which an AI agent can operate on encrypted or protected data without exposing the underlying content, using techniques such as zero-knowledge proofs or trusted execution environments.",
    "scopeNote": "Ty described ZK-proof patterns; Tony Douglas cited TEEs and encrypted vector databases (2026-03-03).",
    "workgroups": ["Security & Privacy", "Identity & Trust"]
  },
  {
    "term": "Prompt injection",
    "category": "Security Practices",
    "aliases": ["Jailbreaking", "Direct prompt injection"],
    "broaderTerm": null,
    "definition": "An attack in which an adversary crafts input that causes an AI agent to override its instructions, bypass safeguards, or execute unintended actions.",
    "scopeNote": "Identified as a mitigation area during ideation (2026-02-17).",
    "workgroups": ["Security & Privacy"]
  },
  {
    "term": "Protected data",
    "category": "Data and Privacy",
    "aliases": ["Regulated data", "Compliance-scoped data"],
    "broaderTerm": "Sensitive data",
    "definition": "Information subject to regulatory or contractual protections (e.g., HIPAA, GDPR), which may include health records, financial data, or other categories that AI agents must handle with specific safeguards.",
    "scopeNote": "Tom Sheffler raised whether AI agents introduce new categories of protected data (2026-03-03).",
    "workgroups": ["Security & Privacy", "Governance, Risk & Regulatory Alignment"]
  },
  {
    "term": "Red teaming",
    "category": "Security Practices",
    "aliases": ["Adversarial testing", "AI pen testing"],
    "broaderTerm": null,
    "definition": "Structured adversarial testing of AI systems in which testers simulate attacks to identify vulnerabilities, failure modes, and security gaps.",
    "scopeNote": "Listed as a brainstorm topic under pen testing and red teaming best practices (2026-02-17).",
    "workgroups": ["Security & Privacy", "Accuracy & Reliability"]
  },
  {
    "term": "Rogue agent",
    "category": "Agentic Threats",
    "aliases": ["Compromised agent", "Runaway agent"],
    "broaderTerm": null,
    "definition": "An AI agent that operates outside its authorized boundaries, whether due to compromise, misconfiguration, or emergent behavior.",
    "scopeNote": "Used in discussion of blast radius and data protection (2026-03-03).",
    "workgroups": ["Security & Privacy"]
  },
  {
    "term": "Secrets",
    "category": "Data and Privacy",
    "aliases": ["API keys", "Cryptographic credentials"],
    "broaderTerm": "Sensitive data",
    "definition": "Traditional credentials and cryptographic material — such as API keys, tokens, passwords, and environment variables — that grant access to systems or services.",
    "scopeNote": "Distinguished from the broader \"sensitive data\" during terminology discussion. Ofek Dadush raised secrets management; David Deng proposed the narrower scope (2026-03-03).",
    "workgroups": ["Security & Privacy", "Identity & Trust"]
  },
  {
    "term": "Sensitive data",
    "category": "Data and Privacy",
    "aliases": ["Confidential data"],
    "broaderTerm": null,
    "definition": "An umbrella term encompassing secrets, PII, proprietary information, and any data whose exposure would cause harm. Preferred over the narrower term \"secrets\" when the intent is to cover all confidential data categories.",
    "scopeNote": "The group debated \"secrets\" vs. \"sensitive data\" and converged on \"sensitive data\" as the broader, less ambiguous term (2026-03-03).",
    "workgroups": ["Security & Privacy", "Governance, Risk & Regulatory Alignment"]
  },
  {
    "term": "Trusted execution environment (TEE)",
    "category": "Infrastructure & Architecture",
    "aliases": ["TEE", "Secure enclave"],
    "broaderTerm": "Privacy-preserving execution",
    "definition": "A secure, hardware-isolated area of a processor that ensures code and data loaded inside are protected from the rest of the system, including the operating system.",
    "scopeNote": "Tony Douglas cited TEE work in the context of privacy-preserving agent workflows (2026-03-03).",
    "workgroups": ["Security & Privacy", "Identity & Trust"]
  },
  {
    "term": "Typo squatting",
    "category": "Agentic Threats",
    "aliases": ["Package name confusion", "Dependency squatting"],
    "broaderTerm": null,
    "definition": "A supply chain attack in which an adversary publishes a malicious server package with a name resembling a legitimate one, hoping users will install it by mistake.",
    "scopeNote": "Raised as a supply chain risk to agentic systems (2026-03-17).",
    "workgroups": ["Security & Privacy", "Accuracy & Reliability"]
  },
  {
    "term": "Zero-knowledge proof (ZKP)",
    "category": "Infrastructure & Architecture",
    "aliases": ["ZKP", "Zero-knowledge cryptography"],
    "broaderTerm": "Privacy-preserving execution",
    "definition": "A cryptographic method by which one party can prove to another that a statement is true without revealing any information beyond the validity of the statement itself.",
    "scopeNote": "Ty described ZKP patterns where agents return only boolean results to prevent data leakage (2026-03-03).",
    "workgroups": ["Security & Privacy"]
  }
];
