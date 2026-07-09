import uuid

from fastapi import APIRouter, HTTPException, status

from app.schemas import ItemCreate, ItemOut, ItemUpdate
from app.supabase_client import items_table

router = APIRouter(prefix="/api/items", tags=["items"])


@router.get("", response_model=list[ItemOut])
def list_items():
    res = items_table().select("*").order("created_at").execute()
    return res.data


@router.post("", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate):
    res = items_table().insert(payload.model_dump(exclude_none=True)).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Insert returned no rows")
    return res.data[0]


@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: uuid.UUID):
    res = items_table().select("*").eq("id", str(item_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return res.data[0]


@router.patch("/{item_id}", response_model=ItemOut)
def update_item(item_id: uuid.UUID, payload: ItemUpdate):
    data = payload.model_dump(exclude_unset=True)
    query = items_table()
    if data:
        res = query.update(data).eq("id", str(item_id)).execute()
    else:
        res = query.select("*").eq("id", str(item_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Item not found")
    return res.data[0]


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: uuid.UUID):
    res = items_table().delete().eq("id", str(item_id)).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Item not found")
