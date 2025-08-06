#!/bin/sh

echo "⏳ Waiting for NATS to start..."
sleep 3

echo "🔑 Creating KV bucket: permissions_cache..."
nats --server nats://nats:4222 kv add permissions_cache || echo "⚠️ Already exists or error"

echo "✅ Done"