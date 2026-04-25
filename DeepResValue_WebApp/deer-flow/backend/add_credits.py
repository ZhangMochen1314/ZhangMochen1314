import sqlite3
import argparse
import sys

import os

DB_PATH = os.path.join(os.path.dirname(__file__), "deerflow.db")

def add_credits(email: str, amount: int):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # 查找用户
        cursor.execute("SELECT id, username, credits FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ 错误: 未找到邮箱为 '{email}' 的用户。")
            sys.exit(1)
            
        user_id, username, current_credits = user
        new_credits = current_credits + amount
        
        # 更新积分
        cursor.execute("UPDATE users SET credits = ? WHERE email = ?", (new_credits, email))
        conn.commit()
        
        print(f"✅ 充值成功!")
        print(f"用户: {username} ({email})")
        print(f"原积分: {current_credits}")
        print(f"充值额: +{amount}")
        print(f"现积分: {new_credits}")
        
    except sqlite3.Error as e:
        print(f"数据库错误: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="手动为用户充值积分")
    parser.add_argument("email", help="用户的注册邮箱")
    parser.add_argument("amount", type=int, help="充值的积分数量")
    
    args = parser.parse_args()
    add_credits(args.email, args.amount)
