import { useEffect, useState } from 'react'
import { AuthAPI, MembershipAPI } from '../lib/api'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [membership, setMembership] = useState<'none'|'gold'>('none')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const me = await AuthAPI.me()
        setUser(me.user)
        const ms = await MembershipAPI.status()
        setMembership(ms.membershipTier || 'none')
      } catch (_e) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Account</h1>
      {loading ? (
        <div className="glass rounded-xl p-6">Loading...</div>
      ) : !user ? (
        <div className="glass rounded-xl p-6">Please sign in to view your profile.</div>
      ) : (
        <>
          <div className="glass rounded-xl p-6">
            <div className="text-sm text-neutral-300">Signed in as</div>
            <div className="font-semibold">{user.name || user.email}</div>
          </div>
          <div className="glass rounded-xl p-6 flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-300">Membership</div>
              <div className="font-semibold">{membership === 'gold' ? 'Gold Member' : 'None'}</div>
            </div>
            {membership !== 'gold' && (
              <button onClick={() => MembershipAPI.enroll('gold').then(()=>setMembership('gold'))} className="h-10 px-4 rounded-md bg-emerald-500 text-black font-medium">Join Gold</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}