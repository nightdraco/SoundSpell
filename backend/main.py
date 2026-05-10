from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import nltk
from nltk.corpus import cmudict
import re
from database import engine, get_db
import models

# Ensure the CMUdict is downloaded before starting
try:
    nltk.data.find('corpora/cmudict')
except LookupError:
    nltk.download('cmudict')

# Create database tables automatically for development
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SoundSpell Academy API")

# Setup CORS so the React frontend can communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the dictionary into memory
cmu_dictionary = cmudict.dict()

class AttemptCreate(BaseModel):
    student_id: int
    target_word: str
    spoken_word: str

class PhoneticEngine:
    @staticmethod
    def get_english_phonemes(word: str) -> list[str]:
        if word not in cmu_dictionary:
            raise HTTPException(status_code=404, detail="Word not found in our magic dictionary!")
            
        pronunciation = cmu_dictionary[word][0]
        return [re.sub(r'\d+', '', p) for p in pronunciation]

    @staticmethod
    def get_indic_phonemes(word: str, language: str) -> list[str]:
        # Placeholder for Indic NLP Library implementation
        # e.g., from indicnlp.syllable import syallabifier
        # return syallabifier.orthographic_syllabify(word, language)
        raise HTTPException(status_code=501, detail=f"Indic language '{language}' support coming soon!")

    @classmethod
    def get_phonemes(cls, word: str, language: str = 'en') -> list[str]:
        if language == 'en':
            return cls.get_english_phonemes(word)
        elif language in ['hi', 'mr']:
            return cls.get_indic_phonemes(word, language)
        else:
            raise HTTPException(status_code=400, detail="Unsupported language")

    @staticmethod
    def analyze_pronunciation(target_word: str, spoken_word: str):
        target_phonemes = PhoneticEngine.get_english_phonemes(target_word)
        spoken_phonemes = PhoneticEngine.get_english_phonemes(spoken_word)
        
        if not target_phonemes or not spoken_phonemes:
            return {"score": 0.0, "errors": [{"error_type": "Unknown Word", "details": "Word not in dictionary"}]}
            
        distance = nltk.edit_distance(target_phonemes, spoken_phonemes)
        max_len = max(len(target_phonemes), len(spoken_phonemes))
        score = max(0, (max_len - distance) / max_len) * 100
        
        errors = []
        if distance > 0:
            if len(spoken_phonemes) < len(target_phonemes):
                errors.append({"error_type": "Omission", "details": "Missing sounds."})
            elif len(spoken_phonemes) > len(target_phonemes):
                errors.append({"error_type": "Insertion", "details": "Extra sounds."})
            else:
                vowels = {'AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'}
                for t, s in zip(target_phonemes, spoken_phonemes):
                    if t != s:
                        error_type = "Vowel Confusion" if t in vowels and s in vowels else "Substitution"
                        errors.append({"error_type": error_type, "details": f"Confused {t} with {s}."})
        return {"score": score, "errors": errors}

@app.get("/api/phonemes/{word}")
async def get_phonemes(word: str, lang: str = 'en'):
    clean_word = word.lower().strip()
    phonemes = PhoneticEngine.get_phonemes(clean_word, lang)
    
    return {
        "word": clean_word,
        "phonemes": phonemes,
        "language": lang
    }

@app.post("/api/attempts/")
async def submit_attempt(attempt: AttemptCreate, db: Session = Depends(get_db)):
    analysis = PhoneticEngine.analyze_pronunciation(attempt.target_word, attempt.spoken_word)
    
    db_attempt = models.Attempt(
        student_id=attempt.student_id,
        target_word=attempt.target_word,
        spoken_word=attempt.spoken_word,
        score=analysis["score"]
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)
    
    for error in analysis["errors"]:
        db_error = models.ErrorLog(
            attempt_id=db_attempt.id,
            error_type=error["error_type"],
            details=error["details"]
        )
        db.add(db_error)
    db.commit()
    
    return {"attempt_id": db_attempt.id, "score": analysis["score"], "errors": analysis["errors"]}

@app.get("/api/words/next")
def get_next_word(level: int = 1):
    levels = {
        1: ["cat", "dog", "sun", "map"], # CVC Continuous/Stop
        2: ["stop", "play", "frog"], # Consonant Blends
        3: ["ship", "chat", "thin"], # Digraphs
        4: ["make", "time", "cute"], # Magic E
    }
    import random
    words = levels.get(level, levels[1])
    return {"word": random.choice(words)}