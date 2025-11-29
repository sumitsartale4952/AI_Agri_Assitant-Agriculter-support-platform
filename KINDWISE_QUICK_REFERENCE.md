# 🎯 Quick Reference - Kindwise API Integration

## Quick Start

### For End Users (Farmers)
```
1. Go to: http://127.0.0.1:4173/crop-disease
2. Click "Choose Image"
3. Select crop leaf photo
4. Get AI diagnosis + treatment
```

### For Developers

**Test Health**:
```bash
curl http://localhost:8000/api/disease/health
```

**Test Image Detection**:
```bash
curl -X POST -F "file=@photo.jpg" \
  http://localhost:8000/api/disease/detect
```

**Test Batch**:
```bash
curl -X POST \
  -F "files=@photo1.jpg" \
  -F "files=@photo2.jpg" \
  http://localhost:8000/api/disease/batch-detect
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/disease/detect` | POST | Single image analysis |
| `/api/disease/batch-detect` | POST | Multiple images |
| `/api/disease/health` | GET | Check service status |

---

## Response Format

### Success
```json
{
  "success": true,
  "disease": "Disease Name",
  "confidence": 95,
  "treatment": ["Option 1"],
  "prevention": ["Measure 1"]
}
```

### Error
```json
{"detail": "Error message"}
```

---

## Configuration

**Backend Port**: 8000
**Frontend Port**: 4173
**API Key**: `WqbiF1J3Sm8vVwSAR4q84ur3P2nCvjOZbvKGEuFuGiLgpfjkbi`
**API URL**: `https://crop.kindwise.com/api/v1`

---

## Files Modified

1. `backend/routes/disease_routes.py` ← NEW
2. `backend/main.py` ← UPDATED
3. `frontend/src/pages/CropDiseasePage.jsx` ← UPDATED

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect | Check if backend running: `python backend/main.py` |
| Upload fails | Ensure image is JPG/PNG, not too large |
| Slow detection | May take up to 5s, be patient |
| API error | Check Kindwise dashboard for limits |

---

## Testing Checklist

- ✅ Backend endpoint: `/api/disease/health` - 200 OK
- ✅ Frontend page loads: `/crop-disease`
- ✅ Image upload works
- ✅ Disease detection returns results
- ✅ Error handling shows messages
- ✅ Loading spinner appears during analysis

---

## Production Notes

- ✅ API key in backend only (secure)
- ✅ Async requests (non-blocking)
- ✅ Timeout protection (30s)
- ✅ Error recovery
- ⚠️  Add rate limiting
- ⚠️  Monitor API usage
- ⚠️  Implement caching

---

**Status**: ✅ Ready
**Last Updated**: November 27, 2025
