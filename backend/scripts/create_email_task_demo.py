"""Drop an AI-drafted outreach email into a HubSpot owner's task queue.

HubSpot has no public "email draft" endpoint, so we create an EMAIL-type task
assigned to the rep (Alexandre) and associated to the contact. The rep opens it,
reviews the draft in the task body, and sends. Re-run creates a new task.

Run from backend/:
    PYTHONPATH=. .venv/bin/python scripts/create_email_task_demo.py
"""

from datetime import datetime, timezone

from app.hubspot_client import create_task

# Alexandre Bellaich (owner) + the demo contact Ada Lovelace @ Acme Demo Co.
ALEXANDRE_OWNER_ID = "47789184"
ADA_CONTACT_ID = "817805615309"

SUBJECT = "Ada — quick idea for Acme's outbound"

BODY = """Hi Ada,

Noticed Acme has been scaling growth fast. I run Beacon — we surface the accounts
already showing buying intent in your market, so your team reaches out before the
competition does.

Worth a quick 15 min next week? I can walk you through the accounts showing intent
around Acme right now.

Best,
Alexandre"""


def main() -> None:
    now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    task_id = create_task(
        properties={
            "hs_task_subject": SUBJECT,
            # Prefix the body with the intended recipient/channel so the rep has
            # full context inside the task; the draft follows.
            "hs_task_body": f"DRAFT EMAIL to Ada Lovelace <ada@beacon-demo-acme.com>\n\n{BODY}",
            "hs_task_type": "EMAIL",
            "hs_task_status": "NOT_STARTED",
            "hs_task_priority": "HIGH",
            "hubspot_owner_id": ALEXANDRE_OWNER_ID,
            "hs_timestamp": now_ms,  # due date
        },
        associate_contact_ids=[ADA_CONTACT_ID],
    )
    print(f"task created: {task_id}")


if __name__ == "__main__":
    main()
