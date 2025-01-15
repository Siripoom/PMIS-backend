
host="$1"
shift
until nc -z "$host" 5433; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 3
done
exec "$@"
