import os

class Settings:
    PROJECT_NAME: str = "AgentTrust"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    # Standard fallback to local SQLite for smooth zero-configuration run
    SQLITE_DB_FILE: str = "agenttrust.db"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///./{SQLITE_DB_FILE}"
    )
    
    # Graph Engine Mock Toggle (using networkx memory graph serialization for seamless setup)
    USE_MOCK_NEO4J: bool = os.getenv("USE_MOCK_NEO4J", "True").lower() == "true"
    
    # Telemetry interval in simulated runs
    TELEMETRY_INTERVAL_SEC: int = 15

settings = Settings()
