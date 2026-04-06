-- 1. 创建用户表 (用于存储账号密码)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- 实际生产中建议加密，这里为了演示先存明文或简单处理
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 重置订阅表 (删除旧的，重新建立包含 category 的表)
DROP TABLE IF EXISTS subscriptions;

CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- 关联到用户
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL, -- 替换了 cycle，比如：娱乐、饮食、交通
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);