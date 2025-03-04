from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .routes.check_health import router as health_router
from .routes.register import router as register_router
from .routes.password_reset import router as password_reset_router
from .routes.all_languages import router as all_languages_router
from .routes.job import router as job_router
from .routes.task import router as task_router
from .routes.qa_member import router as qa_member_router
from .routes.freelancer import router as freelancer_router
from .routes.assessment import router as assessment_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

app.include_router(health_router, tags=["health"], prefix="/health")
app.include_router(register_router, tags=["register"], prefix="/register")
app.include_router(password_reset_router, tags=["password_reset"], prefix="/password_reset")
app.include_router(all_languages_router, tags=["all_languages"], prefix="/all_languages")
app.include_router(job_router, tags=["job"], prefix="/job")
app.include_router(task_router, tags=["task"], prefix="/task")
app.include_router(qa_member_router, tags=["qa_member"], prefix="/qa_member")
app.include_router(freelancer_router, tags=["freelancer"], prefix="/freelancer")
app.include_router(assessment_router, tags=["assessment"], prefix="/assessment")

# if __name__ == "__main__":
#     uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)