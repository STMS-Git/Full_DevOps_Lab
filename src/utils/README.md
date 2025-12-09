# Utilities

## formatStatus(uptimeSeconds)

Converts server uptime in seconds to a human-readable status label.

### Usage

\`\`\`javascript
import { formatStatus } from './utils/status.js'

const uptime = process.uptime()
const status = formatStatus(uptime)
console.log(status) // 'warming-up', 'healthy', or 'steady'
\`\`\`

### Status Labels

| Uptime Range | Status Label | Description |
|--------------|--------------|-------------|
| 0-59s        | warming-up   | Server just started |
| 60-3599s     | healthy      | Server running normally |
| ≥3600s       | steady       | Server stable for 1+ hour |

### Tests

100% test coverage with all edge cases covered.
