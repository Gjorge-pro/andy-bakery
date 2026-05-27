import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''))
export const EVENTS = {
  NEW_ORDER: 'newOrder',
  ORDER_UPDATED: 'orderUpdated',
  DASHBOARD_UPDATED: 'dashboardUpdated',
  NEW_NOTIFICATION: 'newNotification'
}
export default socket
