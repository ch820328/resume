#!/bin/bash

# Simple runner script for resume project

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
fi

COMMAND=$1

function run_full_flow {
    echo "🚀 Starting Full Release Pipeline..."
    if npm run release; then
        echo "✅ Release successful!"
        
        echo "🌐 Starting FastAPI RAG Backend..."
        ./rag_backend/start.sh &
        BACKEND_PID=$!
        
        trap "echo '🛑 Shutting down backend...'; kill \$BACKEND_PID 2>/dev/null; exit" EXIT INT TERM

        echo "🌐 Starting Dev Server..."
        npm run serve
    else
        echo "❌ Release failed. Server not started."
        exit 1
    fi
}

function show_help {
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  (no args)  Run Release + Serve (Build everything and start web server) [DEFAULT]"
    echo "  release    Only run the full release pipeline"
    echo "  serve      Only start the dev server"
    echo "  help       Show this help message"
}

case "$COMMAND" in
    release)
        npm run release
        ;;
    serve)
        echo "🌐 Starting FastAPI RAG Backend..."
        ./rag_backend/start.sh &
        BACKEND_PID=$!
        
        trap "echo '🛑 Shutting down backend...'; kill \$BACKEND_PID 2>/dev/null; exit" EXIT INT TERM

        echo "🌐 Starting Dev Server..."
        npm run serve
        ;;
    help)
        show_help
        ;;
    "")
        run_full_flow
        ;;
    *)
        echo "❌ Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac
