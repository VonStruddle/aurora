"""Prove the HubSpot pipeline end-to-end with invented data (no Supabase needed).

Upserts 2 companies + 3 contacts into HubSpot and associates each contact with
its parent company. Re-runnable: upserts by domain/email, so a second run
updates the same records in place rather than duplicating them.

Run from backend/:
    PYTHONPATH=. .venv/bin/python scripts/hubspot_pipeline_demo.py
"""

from app.hubspot_client import batch_associate_default, upsert_by_property

# Invented target accounts (what a "validated" selection would look like).
ACCOUNTS = [
    {
        "domain": "beacon-demo-acme.com",
        "name": "Acme Demo Co",
        "numberofemployees": 120,
        "description": "Beacon demo account · Tier: A · GMV: $42M",
    },
    {
        "domain": "beacon-demo-globex.com",
        "name": "Globex Demo",
        "numberofemployees": 45,
        "description": "Beacon demo account · Tier: B · GMV: $18M",
    },
]

# Invented contacts, each tied to a company via parent_domain.
CONTACTS = [
    {
        "email": "ada@beacon-demo-acme.com",
        "firstname": "Ada",
        "lastname": "Lovelace",
        "jobtitle": "Head of Growth",
        "parent_domain": "beacon-demo-acme.com",
    },
    {
        "email": "alan@beacon-demo-acme.com",
        "firstname": "Alan",
        "lastname": "Turing",
        "jobtitle": "CTO",
        "parent_domain": "beacon-demo-acme.com",
    },
    {
        "email": "grace@beacon-demo-globex.com",
        "firstname": "Grace",
        "lastname": "Hopper",
        "jobtitle": "VP Marketing",
        "parent_domain": "beacon-demo-globex.com",
    },
]


def main() -> None:
    # 1) Companies — create-or-update by domain.
    domain_to_id = upsert_by_property("companies", "domain", ACCOUNTS)
    print(f"companies upserted: {len(domain_to_id)}")
    for domain, cid in domain_to_id.items():
        print(f"  {domain} -> {cid}")

    # 2) Contacts — create-or-update by email.
    contact_props = [
        {k: v for k, v in c.items() if k != "parent_domain"} for c in CONTACTS
    ]
    email_to_id = upsert_by_property("contacts", "email", contact_props)
    print(f"contacts upserted: {len(email_to_id)}")
    for email, cid in email_to_id.items():
        print(f"  {email} -> {cid}")

    # 3) Associate each contact with its parent company.
    pairs = []
    for c in CONTACTS:
        contact_id = email_to_id.get(c["email"].lower())
        company_id = domain_to_id.get(c["parent_domain"].lower())
        if contact_id and company_id:
            pairs.append((contact_id, company_id))
    associated = batch_associate_default("contacts", "companies", pairs)
    print(f"associations created: {associated}")


if __name__ == "__main__":
    main()
