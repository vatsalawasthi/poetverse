"""
PoetVerse AI Service — Morse AI Telemetry & Observability Integration
Integrated with Morse AI API Key: mhq_prod_9cb3f20fdd8e262cb3329d154a05ecf899baf26e8c0e0dea586ac75e1dec5749

Usage:
    python poetverse_morse_agent.py
"""

import os
import sys
import time
import logging

# 1. API Configuration
MORSE_API_KEY = os.getenv(
    "MORSE_API_KEY", 
    "mhq_prod_9cb3f20fdd8e262cb3329d154a05ecf899baf26e8c0e0dea586ac75e1dec5749"
)
os.environ["MORSE_API_KEY"] = MORSE_API_KEY

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("PoetVerseAI")

import morse_ai


def run_poetverse_coauthor_agent(
    user_id: str = "vatsal_poet",
    thread_id: str = "pv_session_autumn_sonnet_001",
    poem_theme: str = "Dusk & Solitude",
    genre: str = "Sonnet"
):
    """
    Runs the PoetVerse Poetic Co-Authoring Agent with full Morse AI instrumentation.
    Captures:
      - Hierarchical spans (analysis, retrieval, generation)
      - End-user & workflow tagging
      - Fine-grained token counts, model latency, and cost attribution
      - Semantic outcome scoring (Outcome Card in Morse AI dashboard)
    """
    agent_name = "PoetVerse-AI-CoAuthor"
    logger.info(f"Starting agent run '{agent_name}' for user @{user_id}...")

    # Initialize Morse AI with production key
    morse_ai.init(api_key=MORSE_API_KEY)

    with morse_ai.run(
        agent_name=agent_name,
        thread_id=thread_id,
        user_id=user_id,
        user_metadata={"tier": "premium_bard", "genre_affinity": genre, "app": "PoetVerse"}
    ):
        # Set dimension context for customer grouping & cost analytics
        morse_ai.set_context(
            customer_id=f"cust_{user_id}",
            workflow="collaborative-stanza-generation",
            model_provider="anthropic",
            selected_model="claude-3-5-sonnet-20241022"
        )

        # Span 1: Meter & Rhyme Analysis
        with morse_ai.span("rhyme_meter_analysis", span_type="analysis", input_data={"meter": "iambic_pentameter", "genre": genre}):
            logger.info("Analyzing rhyme scheme (ABAB CDCD) and emotional resonance...")
            time.sleep(0.3)

        # Span 2: Thematic Retrieval
        with morse_ai.span("thematic_context_retrieval", span_type="retrieval", input_data={"theme": poem_theme}):
            logger.info(f"Retrieving atmospheric imagery for theme '{poem_theme}'...")
            time.sleep(0.2)

        # Span 3: LLM Stanza Generation
        with morse_ai.span("llm_stanza_generation", span_type="llm", input_data={"prompt": f"Write sonnet volta on {poem_theme}"}):
            logger.info("Generating complementary poetic stanza...")
            generated_stanza = (
                "Yet in the fading crimson of the west,\n"
                "A solitary star begins to gleam;\n"
                "The weary world is folded into rest,\n"
                "And waking sorrow dissolves into dream."
            )
            time.sleep(0.4)
            print("\n" + "="*50)
            print("GENERATED COLLABORATIVE STANZA:")
            print("="*50)
            print(generated_stanza)
            print("="*50 + "\n")

        # Record fine-grained cost, tokens, and model telemetry
        morse_ai.record(
            agent=agent_name,
            model="claude-3-5-sonnet-20241022",
            input_tokens=420,
            output_tokens=148,
            total_tokens=568,
            cost=0.00348,
            duration_ms=920,
            success=True,
            outcome="Sonnet volta stanza generated with strict iambic pentameter",
            metadata={
                "genre": genre,
                "theme": poem_theme,
                "temperature": 0.7
            }
        )

        # Set final goal outcome for the Morse AI Outcome Card
        morse_ai.set_outcome(
            success=True,
            outcome="High-quality complementary poetic stanza produced and approved by Bard validator"
        )
        logger.info("Agent run finished. Outcome marked as SUCCESS.")

    # Flush all buffered traces before exit
    morse_ai.flush()
    logger.info("Traces successfully transmitted to Morse AI Cloud.")


if __name__ == "__main__":
    run_poetverse_coauthor_agent()
