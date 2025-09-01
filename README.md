# FinTrack - Finance Tracking Application (Frontend)

Mobile application for personal expense tracking: receipt scanning (OCR), manual entry, categorization, and analytics.  
This repository contains the **client-side** built with **React Native**, **Expo**, and **Expo Router**.

---

## ✨ Features

- Onboarding, registration, and login (JWT-based)
- Scan receipts via camera or import from gallery (OCR handled by backend)
- Manual receipt entry and editing
- Categorization of expenses and “favorite” categories
- Receipt history with filtering, sorting, and pagination
- Analytics: monthly summaries, average receipt value, spending by category and store

---

## 🧰 Tech Stack

- **React Native** (Expo)
- **Expo Router** (navigation)
- **Axios** (HTTP requests) + **AsyncStorage** (local token storage)
- **react-native-chart-kit**, **react-native-svg** (charts)
- **react-native-progress**, RN **Animated** (UI & animations)

---

## 📦 Project Structure

- **app/** → Navigation and main screens (Expo Router)  
- **components/** → Reusable UI building blocks (charts, buttons, modals, menus, etc.)  
- **services/** → Centralized API communication (Axios client + domain services)  
- **utils/** → General helper functions  
- **assets/** → Static resources (icons, images, illustrations) 

---

## 🔐 Authentication

- Backend returns a JWT after successful registration/login.
- Token is stored in AsyncStorage.
- Interceptor in apiClient.ts automatically adds Authorization: Bearer <token> to all protected requests.

## 📊 Analytics

- Monthly Spending, Average Receipt Value
- Spendings of Last 4 Months (bar chart)
- Spending Overview by Category & Spending by Store (pie charts)

## 📷 Screenshots

### Onboarding Flow
<div align="center">
  <img src="./screenshots/signin/onboarding.png" alt="Welcome to FinTrack" height="500"/>
</div>

### Sign Up / Log In
<div align="center">
  <img src="./screenshots/signin/register.png" alt="Sign Up Screen" width="30%"/>
   <img src="./screenshots/signin/login.png" alt="Login Screen" width="30%"/>
</div>

### Home Screen
<div align="center">
   <img src="./screenshots/home.png" alt="Login Screen" height="500"/>
</div>

### Profile 
<div align="center">
  <img src="./screenshots/profile/profile.png" alt="Sign Up Screen" height="500"/>
   <img src="./screenshots/profile/edit_profile.png" alt="Login Screen" height="500"/>
</div>

### Analytics 
<div align="center">
   <img src="./screenshots/analytics.png" alt="Login Screen" height="500"/>
</div>

### New Receipt 
<div align="center">
  <img src="./screenshots/new_receipt/new_receipt_loading.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/new_receipt/new_receipt.png" alt="Login Screen" height="500"/>
</div>
<div align="center">
  <img src="./screenshots/new_receipt/new_receipt_preview.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/new_receipt/new_receipt_cancel.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/new_receipt/new_receipt_success.png" alt="Login Screen" height="500"/>
</div>

### Categories Screen
<div align="center">
  <img src="./screenshots/categories/categories_1.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_2.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_3.png" alt="Login Screen" height="500"/>
</div>
<div align="center">
    <img src="./screenshots/categories/categories_4.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_5.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_6.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_7.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_8.png" alt="Login Screen" height="500"/>
  <img src="./screenshots/categories/categories_9.png" alt="Login Screen" height="500"/>
</div>

