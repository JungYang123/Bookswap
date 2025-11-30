from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.supabase import supabase

router = APIRouter()

class BookCreate(BaseModel):
    title: str
    author: Optional[str] = None
    isbn: Optional[str] = None
    genre: Optional[str] = None
    material_type: Optional[str] = None
    trade_type: Optional[str] = None
    price: float
    condition: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    seller_name: str
    seller_email: str

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

@router.post("/")
def create_book(book: BookCreate):
    """
    Create a new book listing.
    """
    try:
        response = supabase.table("books").insert(book.model_dump()).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create book")

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating book: {str(e)}")

@router.delete("/{book_id}")
def delete_book(book_id: str):
    """
    Delete a book listing by ID.
    """
    try:
        # First check if book exists
        check_response = supabase.table("books").select("*").eq("id", book_id).execute()
        
        if not check_response.data:
            raise HTTPException(status_code=404, detail="Book not found")

        # Delete the book
        supabase.table("books").delete().eq("id", book_id).execute()

        return {"message": "Book deleted successfully", "id": book_id}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting book: {str(e)}")

