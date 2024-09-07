from fastapi import APIRouter
from app.api.api_v1.endpoints import users,login,author,publisher,book,journal_article,magazine,documents,loan,payment,credit_card

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(author.router, prefix="/authors", tags=["authors"])
api_router.include_router(publisher.router, prefix="/publishers", tags=["publishers"])
api_router.include_router(book.router, prefix="/books", tags=["books"])
api_router.include_router(journal_article.router, prefix="/journal_articles", tags=["journal_articles"])
api_router.include_router(magazine.router, prefix="/magazines", tags=["magazines"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(loan.router,prefix="/loans",tags=["loans"])
api_router.include_router(credit_card.router,prefix="/creditcards",tags=["creditcards"])
api_router.include_router(payment.router,prefix="/payments",tags=["payments"])
