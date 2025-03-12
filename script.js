import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, where } from './firebase.js';

const authContainer = document.getElementById('auth-container');
const tasksContainer = document.getElementById('tasks-container');
const loginForm = document.getElementById('login-form');
const switchToSignup = document.getElementById('switch-to-signup');
const logoutBtn = document.getElementById('logout-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task');
const tasksList = document.getElementById('tasks-list');

let isLogin = true;

// Gestion de l'authentification
auth.onAuthStateChanged(user => {
  if (user) {
    authContainer.style.display = 'none';
    tasksContainer.style.display = 'block';
    loadTasks(user.uid);
  } else {
    authContainer.style.display = 'flex';
    tasksContainer.style.display = 'none';
  }
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    alert(`Erreur: ${error.message}`);
  }
});

switchToSignup.addEventListener('click', () => {
  isLogin = !isLogin;
  loginForm.querySelector('button').textContent = isLogin ? 'Se connecter' : 'Créer un compte';
  switchToSignup.textContent = isLogin ? 'Créer un compte' : 'Se connecter';
});

logoutBtn.addEventListener('click', () => signOut(auth));

// Gestion des tâches
async function loadTasks(userId) {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  
  onSnapshot(q, snapshot => {
    tasksList.innerHTML = '';
    snapshot.forEach(doc => {
      const task = doc.data();
      const taskElement = document.createElement('div');
      taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
      taskElement.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${task.text}</span>
        <div class="task-actions">
          <button class="delete-btn">🗑️</button>
        </div>
      `;

      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      const deleteBtn = taskElement.querySelector('.delete-btn');

      checkbox.addEventListener('change', () => toggleTask(doc.id, !task.completed));
      deleteBtn.addEventListener('click', () => deleteTask(doc.id));

      tasksList.appendChild(taskElement);
    });
  });
}

async function addTask(text, userId) {
  if (text.trim()) {
    await addDoc(collection(db, 'tasks'), {
      text: text.trim(),
      completed: false,
      userId: userId,
      createdAt: new Date()
    });
    newTaskInput.value = '';
  }
}

async function toggleTask(taskId, completed) {
  await updateDoc(doc(db, 'tasks', taskId), { completed });
}

async function deleteTask(taskId) {
  await deleteDoc(doc(db, 'tasks', taskId));
}

addTaskBtn.addEventListener('click', () => {
  const user = auth.currentUser;
  if (user) addTask(newTaskInput.value, user.uid);
});

newTaskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    const user = auth.currentUser;
    if (user) addTask(newTaskInput.value, user.uid);
  }
});

