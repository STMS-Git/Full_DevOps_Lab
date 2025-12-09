/**
 * Converts uptime in seconds to a status label
 *
 * @param {number} uptimeSeconds - Server uptime in seconds
 * @returns {string} Status label: 'warming-up', 'healthy', or 'steady'
 *
 * @example
 * formatStatus(30)     // → 'warming-up'
 * formatStatus(1800)   // → 'healthy'
 * formatStatus(7200)   // → 'steady'
 */
export function formatStatus (uptimeSec) {
  if (uptimeSec < 0) throw new Error('invalid uptime')
  if (uptimeSec < 60) return 'warming-up'
  if (uptimeSec < 3600) return 'healthy'
  return 'steady'
}
