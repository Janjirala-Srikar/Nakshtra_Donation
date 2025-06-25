import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../components/firebase';
import axios from 'axios';

// 🔸 User Signup Function (Email/Password)
export async function signupUser({ email, password, name, username, phone }) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken();

  await axios.post('http://localhost:5000/api/users/signup', {
    name, username, email, phone
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return userCred.user;
}

// 🔸 Email/Password Signin
export async function signinUser({ email, password }) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
}

// 🔸 Google Signin
export async function signinWithGoogle() {
  const userCred = await signInWithPopup(auth, googleProvider);
  const token = await userCred.user.getIdToken();
  console.log(userCred,token);
  const { email, displayName } = userCred.user;

  await axios.post('http://localhost:5000/api/users/google-signin', {
    email,
    name: displayName,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return userCred.user;
}

// 🔸 Google Signup (optional: if handled separately from signin)
export async function signupUserWithGoogle() {
  const userCred = await signInWithPopup(auth, googleProvider);
  const token = await userCred.user.getIdToken();

  const { email, displayName, phoneNumber, uid, photoURL } = userCred.user;
  console.log(email, displayName, phoneNumber, uid, photoURL);

  await axios.post('http://localhost:5000/api/users/google-signup', {
    email,
    name: displayName,
    phone: phoneNumber,
    uid,
    photoURL,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return userCred.user;
}
