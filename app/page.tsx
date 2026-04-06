'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  name: string
  price: number
  category: string // 现在的字段是 category
  created_at: string
}

export default function Home() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  
  // 表单状态
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('饮食') // 默认类别
  const [loading, setLoading] = useState(false)

  // 1. 检查登录状态
  useEffect(() => {
    const user = localStorage.getItem('user_id')
    if (!user) {
      router.push('/login') // 没登录就踢去登录页
    } else {
      setUserId(user)
    }
  }, [router])

  // 2. 获取数据 (只获取当前用户的)
  const fetchSubscriptions = async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId) // 关键：加上用户ID过滤
      .order('created_at', { ascending: false })
    
    if (data) setSubscriptions(data)
  }

  useEffect(() => {
    if (userId) fetchSubscriptions()
  }, [userId])

  // 3. 添加数据
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !userId) return

    setLoading(true)
    const { error } = await supabase.from('subscriptions').insert([
      { 
        user_id: userId, // 绑定当前用户
        name: name.trim(), 
        price: Number(price), 
        category: category 
      }
    ])

    if (!error) {
      setName('')
      setPrice('')
      fetchSubscriptions()
    }
    setLoading(false)
  }

  // 4. 删除数据
  const handleDelete = async (id: string) => {
    if(!confirm('确定删除？')) return
    await supabase.from('subscriptions').delete().eq('id', id)
    fetchSubscriptions()
  }

  // 5. 退出登录
  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  // 计算总价
  const total = subscriptions.reduce((acc, curr) => acc + curr.price, 0)

  if (!userId) return <div style={{padding: 20}}>加载中...</div>

  return (
    <div style={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f3f4f6', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        {/* 顶部导航栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>📒 我的个人记账本</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>退出登录</button>
        </div>

        {/* 统计卡片 */}
        <div style={{ backgroundColor: '#2563eb', padding: '20px', borderRadius: '12px', color: 'white', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 5px 0', opacity: 0.9 }}>本月总支出</p>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>${total.toFixed(2)}</div>
        </div>

        {/* 添加账单表单 */}
        <form onSubmit={handleAdd} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <input
            type="text"
            placeholder="项目 (如 午餐)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minWidth: '120px' }}
            required
          />
          <input
            type="number"
            placeholder="金额"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="饮食">🍔 饮食</option>
            <option value="娱乐">🎬 娱乐</option>
            <option value="交通">🚗 交通</option>
            <option value="购物">🛍️ 购物</option>
            <option value="居住">🏠 居住</option>
            <option value="其他">📦 其他</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '...' : '+ 记一笔'}
          </button>
        </form>

        {/* 列表区域 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {subscriptions.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>还没有记账，快添加一笔吧！</div>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub.id} style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#333' }}>{sub.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#666', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>
                    {sub.category}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>${sub.price}</span>
                  <button onClick={() => handleDelete(sub.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>删除</button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}