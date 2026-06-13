import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, CheckCircle, Circle, LogOut } from "lucide-react";
import { collection, addDoc, onSnapshot, query, where, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/config";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: any;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "todos"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      setTodos(todosData);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;
    
    try {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewTodo("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        completed: !currentStatus
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteTodoItem = async (id: string) => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header flex-between">
        <div>
          <h2>내 할 일 관리</h2>
          <p className="subtitle">{user?.email}님, 환영합니다!</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline icon-btn logout-btn">
          <LogOut size={18} />
          <span>로그아웃</span>
        </button>
      </div>

      <div className="todo-panel glass-panel">
        <form onSubmit={handleAddTodo} className="todo-form">
          <input 
            type="text" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="새로운 할 일을 입력하세요..."
            className="todo-input"
          />
          <button type="submit" className="btn btn-primary icon-btn">
            <Plus size={20} />
            <span>추가</span>
          </button>
        </form>

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button 
                  className="todo-toggle" 
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                >
                  {todo.completed ? <CheckCircle size={24} className="text-primary" /> : <Circle size={24} />}
                </button>
                <span className="todo-text">{todo.text}</span>
                <button 
                  className="todo-delete"
                  onClick={() => deleteTodoItem(todo.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
