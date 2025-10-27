#!/bin/bash
# Setup correct .env.local file

cat > .env.local << 'EOF'
# ==================================================================================
# Environment Variables for LOCAL DEVELOPMENT ONLY
# ==================================================================================

# BACKEND Variables (for serverless functions)
HF_SPACE_URL=https://nawaf707-teledentai.hf.space
HF_TOKEN=

# FRONTEND Variable - LEAVE EMPTY!
# REACT_APP_API_URL=

# ==================================================================================
# EXPLANATION:
# - HF_SPACE_URL: ALWAYS needed (tells serverless functions where Space is)
# - HF_TOKEN: Only if Space is PRIVATE (leave empty if public)
# - REACT_APP_API_URL: Should be EMPTY (so frontend uses relative URLs)
# ==================================================================================
EOF

echo "✅ Created .env.local file"
echo "📝 Edit it to add your HF_TOKEN if your Space is private"


