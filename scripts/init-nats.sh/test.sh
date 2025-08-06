#!/bin/sh

echo "📡 Sending test permissions..."

docker run --rm --network=nats-example_default natsio/nats-box \
  nats --server nats://nats:4222 req permissions.grant '{"apiKey":"abcd-1234","module":"trades","action":"create"}'

docker run --rm --network=nats-example_default natsio/nats-box \
  nats --server nats://nats:4222 req permissions.list '{"apiKey":"abcd-1234"}'

docker run --rm --network=nats-example_default natsio/nats-box \
  nats --server nats://nats:4222 req permissions.check '{"apiKey":"abcd-1234","module":"trades","action":"create"}'

docker run --rm --network=nats-example_default natsio/nats-box \
  nats --server nats://nats:4222 req permissions.revoke '{"apiKey":"abcd-1234","module":"trades","action":"create"}'

docker run --rm --network=nats-example_default natsio/nats-box \
  nats --server nats://nats:4222 req permissions.list '{"apiKey":"abcd-1234"}'
