import sqlite3 as sql
import bcrypt

def init_db():
    con = sql.connect('database.db')
    cur = con.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            wallet REAL DEFAULT 1000
        )
    ''')
    con.commit()
    con.close()

def insertUser(username, password, wallet=1000):
    init_db()
    if not username or not password:
        return False, "Username and password required."
    try:
        con = sql.connect('database.db')
        cur = con.cursor()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        username = username.replace("<", "&lt;").replace(">", "&gt;")
        username = username.replace('"', "&quot;").replace("'", "&apos;")
        cur.execute("INSERT INTO users (username, password, wallet) VALUES (?, ?, ?)", (username, hashed_password.decode("utf-8"), wallet))
        con.commit()
        con.close()
        return True, "User created."
    except sql.IntegrityError:
        return False, "Username already exists."
    except Exception as e:
        return False, str(e)

def retrieveUser(username, password):
    init_db()
    con = sql.connect("database.db")
    cur = con.cursor()
    cur.execute("SELECT id, username, password, wallet FROM users WHERE username = ?", (username,))
    result = cur.fetchone()
    if not result:
        con.close()
        return None
    user_id, username, stored_hash, wallet = result
    if bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
        con.close()
        return {"id": user_id, "username": username, "wallet": wallet}
    else:
        con.close()
        return None
