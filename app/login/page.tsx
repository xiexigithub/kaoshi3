'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true) // 切换登录/注册模式
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // --- 登录逻辑 ---
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .eq('password', password) 
          .single()

        if (error || !data) {
          setError('邮箱或密码错误')
        } else {
          localStorage.setItem('user_id', data.id)
          localStorage.setItem('user_email', data.email)
          router.push('/') 
        }
      } else {
        // --- 注册逻辑 ---
        const { data, error } = await supabase
          .from('users')
          .insert([{ email, password }])
          .select()
          .single()

        if (error) {
          if (error.code === '23505') setError('该邮箱已被注册')
          else setError('注册失败')
        } else {
          localStorage.setItem('user_id', data.id)
          localStorage.setItem('user_email', data.email)
          router.push('/')
        }
      }
    } catch (err) {
      setError('发生未知错误')
    }

    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '420px' 
      }}>
        
        {/* 1. 醒目的标题和应用描述 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📒</div>
          <h2 style={{ margin: '0 0 10px 0', color: '#1f2937', fontSize: '1.8rem', fontWeight: '800' }}>
            我的个人记账本
          </h2>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
            简单、高效的订阅与支出管理工具<br/>
            帮你理清每一笔账单，掌握财务状况
          </p>
        </div>
        
        {error && <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '6px' }}>{error}</p>}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>电子邮箱</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>密码</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '14px', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '1rem',
              marginTop: '10px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            {loading ? '处理中...' : (isLogin ? '立即登录' : '免费注册')}
          </button>
        </form>

        {/* 2. 醒目的切换按钮样式 */}
        <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '0' }}>
            {isLogin ? '还没有账号？' : '已经有账号了？'}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                color: '#2563eb', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                marginLeft: '5px',
                textDecoration: 'underline',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.color = '#2563eb'}
            >
              {isLogin ? '去注册' : '去登录'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}