# Launch script in background
pm2 logs index &
# Get its PID
LOGSPID=$!
# Wait for 2 seconds
sleep 2
# Kill it
kill $LOGSPID
