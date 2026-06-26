import { Playbook } from './types';

export const PLAYBOOKS: Playbook[] = [
  {
    slug: 'hyper-scale-backend',
    title: 'Industry-Specific AI Playbooks',
    subtitle: '',
    track: 'Professional',
    price: 189,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    summary: 'Hyper-targeted workflows for your daily grind. Whether you\'re automating data pipelines, accelerating legal document review, or mastering Claude and Google AI Studio, get the exact frameworks to scale your output.',
    fullDesc: 'Building ledgers that scale to millions of concurrent ledger writes demands a total rethink of transactional boundary design. This blueprint uncovers the production mechanisms deployed by elite organizations to handle distributed state consensus in isolated environments.',
    chapters: [
      {
        id: 'chapter-1',
        title: '01. Sharding Strategies & Database Layout',
        estimatedMinutes: 12,
        content: `### 1. Database Sharding Fundamentals
Dynamic horizontal partitioning (sharding) divides logical database tables across physical database infrastructure nodes. In financial ledger systems, selecting the partition key requires evaluating hot-spots.
          
* **Key-based sharding** using consistent hashing prevents unbalanced partitions.
* **Range-based sharding** is optimal for temporal queries, but hazards bottlenecking on current writes.
* **Directory-based sharding** centralizes configuration state but adds network hops.

\`\`\`json
{
  "partitionKey": "tenant_id",
  "routingStrategy": "consistent_hashing",
  "replicaFactor": 3
}
\`\`\`

### 2. Eliminating Single Points of Contention
A major pitfall in high-throughput database systems is the logical "mutex lock" or static global sequence generator. Systems should deploy distributed ID allocation frameworks, e.g., Snowflake ID structures or cryptographically signed local UUID counters. This preserves sequence sorting while decoupling transaction nodes from sync coordinates.`
      },
      {
        id: 'chapter-2',
        title: '02. Safe State Mutations without Locks',
        estimatedMinutes: 20,
        content: `### 1. Lock-free Concurrency & Event Sourcing
Traditional ACID transactions fail under global lock contention. Instead, implement append-only event streams. Any state change is serialized as an immutable historic event. It is applied locally to derive the material view.

* **Optimistic Offline Concurrency**: Read version token prior to state modification.
* **CAS (Compare-And-Swap)** instructions check base offsets:
\`\`\`sql
UPDATE ledger_balances 
SET cents = cents + :amount, last_version = :new_version 
WHERE ledger_id = :id AND last_version = :current_version;
\`\`\`

### 2. Multi-Version Concurrency Control (MVCC)
In modern databases, readers never block writers and writers never block readers. This occurs by maintaining chronological copies (epochs) of stored rows. Non-overlapping logical snapshots safeguard transaction continuity without physical barrier locks.`
      },
      {
        id: 'chapter-3',
        title: '03. Handling Temporary Network Partitions',
        estimatedMinutes: 15,
        content: `### 1. Resolving the CAP Theorem Split-Brain
When physical network partitions occur, distributed databases must choose Consistency (C) or Availability (A). For mission-critical ledgers, choose Consistency and implement Paxos or Raft heartbeat consensus models.

* **Split-brain Prevention**: Only the partition retaining a strict mathematical majority (> 50%) can accept state mutations.
* **Gossip Protocols**: Isolated nodes use randomized epidemic routing algorithms to propagate peer health checklists.

### 2. Read Repair and Anti-Entropy
Anti-entropy routines run continuously in background daemons. They utilize Merkle Trees (hierarchical hashing networks) to quickly synchronize files and reconcile storage state discrepancies without traversing raw data streams.`
      }
    ]
  },
  {
    slug: 'digital-couture-design',
    title: 'Bespoke Blueprint Engineering',
    subtitle: '',
    track: 'Custom',
    price: 145,
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600',
    summary: 'Have a unique execution goal or a specific skill to master? Share your parameters during a strategy session, and we will custom-architect a definitive, step-by-step playbook tailored exactly to your workflow.',
    fullDesc: 'Traditional UI frameworks commoditize the web. Digital Couture teaches you how to construct high-fashion digital experiences that invoke status, leverage radical asymmetry, and treat modern web layouts like gallery exhibitions.',
    chapters: [
      {
        id: 'chapter-1',
        title: '01. The Art of Brutalist Luxury Web Space',
        estimatedMinutes: 10,
        content: `### 1. Spatial Overabundance as an Asset
Luxury is defined by surplus. In web design, this translates to generous spatial padding and dramatic negative space. Over-packing layouts reduces perception of prestige.

* **Minimal Containment**: Replace thick border boundaries with fine, 1px semi-transparent divisions (#FFFFFF at 8% opacity).
* **Negative Space Targets**: Keep content blocks constrained to a 12-column grid inside focused center structures, allowing the outer margins to breathe.

### 2. Mathematical Typography Pairing
Establishing visual hierarchy requires extreme typographic contrast. Use a premium, high-lineage editorial Serif (e.g., Bodoni Moda) in massive display weights paired with a rigorous, technical monospace font (e.g., JetBrains Mono).`
      },
      {
        id: 'chapter-2',
        title: '02. Cinematic Glass Surfaces & Backdrop Physics',
        estimatedMinutes: 18,
        content: `### 1. Layering with Tonal Depth & Ambient Blur
Glassmorphism adds depth by mimicking frosted sheet-glass. The design is calculated using low alpha opacities blended with intensive CSS backdrop filters.

\`\`\`css
.glass-panel {
  background: rgba(18, 20, 20, 0.4);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
\`\`\`

* **Color Shifts**: Rely on transitions from pitch-black (#000000) to slate container depths (#121414).
* **Specular Highlights**: Add thin linear gradient borders that simulate subtle light reflection on sharp edges of high-end consumer hardware.`
      },
      {
        id: 'chapter-3',
        title: '03. Intentional Micro-Animations & Interactivity',
        estimatedMinutes: 14,
        content: `### 1. Non-linear Transition Curves
Standard ease-in-out animations feel lazy and artificial. Adopt snappy bezier curves that simulate natural momentum and mechanical deceleration.

* **The Brutalist Snick**: Quick fade-intersections combined with structural layout alterations.
* **Custom Bezier**: Use \`cubic-bezier(0.16, 1, 0.3, 1)\` for elite camera zooms and sidebar slide-outs to replicate physical luxurious inertia.`
      }
    ]
  },
  {
    slug: 'sovereign-ai-orchestration',
    title: 'Sovereign AI Infrastructure',
    subtitle: 'Enterprise-Grade Model Hosting, Privacy Firewalls & Private Data Pools',
    track: 'Technical',
    price: 250,
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=600',
    summary: 'The operational handbook on deploying offline-first local LLM pipelines, private document parsing engines, and zero-leak API routing.',
    fullDesc: 'A rigorous blueprint showing modern software teams how to bypass centralized API model dependencies, deploy customized local models, and protect intellectual proprietary context from third-party training pipelines.',
    chapters: [
      {
        id: 'chapter-1',
        title: '01. Architecture of Host-Your-Own GenAI Services',
        estimatedMinutes: 18,
        content: `### 1. Running Secure Offline Transformers
Self-hosting machine learning models grants total governance over system outputs. Deploy high-capacity open-weight networks on internal GPUs.

* **GPU Memory Quantization**: Use 4-bit and 8-bit quantized parameters to run expansive models on consumer workstation clusters.
* **Server Intermediaries**: Build secure Node.js proxy layers that communicate locally with server processes, keeping the operational system air-gapped.

### 2. Privacy-first Context Firewalls
Never let raw client documents float directly to external public servers. Strip identification values, scrub user telemetry data, and run regex scrubbing pipelines on data streams prior to model input compilation.`
      },
      {
        id: 'chapter-2',
        title: '02. Constructing Retrieval-Augmented Generation (RAG) Pipelines',
        estimatedMinutes: 22,
        content: `### 1. Vector Database Partitioning & Vector Calculations
RAG systems connect general model intelligence with specialized private directories. This is accomplished by chunking, embedding, and query matching.

* **Cosine Similarity calculations** ensure rapid retrieval of top contextual rows.
* **Hybrid Storage indexing** merges classic statistical indices with multi-dimensional vector matrices to ensure accurate outputs.

### 2. Dynamic Source Quotation and Context Blending
Blend queried context documents cleanly within prompt formulations. Always provide direct reference metadata so readers can verify model outputs against original blueprints.`
      }
    ]
  }
];

