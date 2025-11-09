from fastapi import APIRouter, HTTPException
from typing import List, Optional
from utils.supabase import supabase

router = APIRouter()

@router.get("/")
def get_books():
    """
    Get all available books from the database.
    Returns a list of books with all their details.
    """
    try:
        # Query the books table from Supabase
        response = supabase.table("books").select("*").execute()
        
        if not response.data:
            return []
        
        return response.data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching books: {str(e)}")

@router.get("/{book_id}")
def get_book_by_id(book_id: str):
    """
    Get a specific book by its ID.
    """
    try:
        response = supabase.table("books").select("*").eq("id", book_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Book not found")
        
        return response.data[0]
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching book: {str(e)}")

