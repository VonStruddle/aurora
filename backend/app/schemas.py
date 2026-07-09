import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemBase(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: str | None = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = None


class ItemOut(ItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CompanySignal(BaseModel):
    """One intent/engagement signal family present on a brand."""

    key: str
    label: str
    last_at: str | None = None
    high_intent: bool = False


class CompanyOut(BaseModel):
    """One row from internal.marketing.brands (parent brands only)."""

    company_name: str | None = None
    domain: str | None = None
    platform: str | None = None
    som_category: str | None = None
    tier: str | None = None
    marketing_gmv_category: str | None = None
    industry_cleaned: str | None = None
    has_deal: bool | None = None
    signals: list[CompanySignal] = []


class CompaniesPage(BaseModel):
    companies: list[CompanyOut]
    page: int
    page_size: int
    # True when at least one more row exists past this page (avoids counting
    # ~15M rows on every request — we fetch page_size + 1 and check the overflow).
    has_more: bool


class TamTier(BaseModel):
    """Total GMV (TAM) contribution of one SOM tier."""

    tier: str  # unaware | aware | interested | evaluating | selecting
    label: str
    gmv: float
    brand_count: int


class TamByTier(BaseModel):
    total_gmv: float
    total_brands: int
    # Ordered along the canonical SOM ladder (cold -> hot).
    tiers: list[TamTier]


# --- Beacon (Weekly Hot Accounts) — shape mirrors app/src/data.ts ---


class BeaconSignal(BaseModel):
    icon: str  # kebab-case lucide name
    text: str
    meta: str = ""


class BeaconPerson(BaseModel):
    name: str
    title: str
    persona: str  # Founder | Marketing | Ecommerce | Retention | Finance | Data
    champion: bool = False
    email: str = ""
    phone: str = ""
    angle: str = ""


class BeaconCompany(BaseModel):
    logo: str
    color: str
    name: str
    score: str  # hot | warm
    sector: str = ""
    size: str = ""
    cc: str = ""
    domain: str
    signals: list[BeaconSignal] = []
    people: list[BeaconPerson] = []


class BeaconAccounts(BaseModel):
    week_of: str
    companies: list[BeaconCompany]
