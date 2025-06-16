# HRoS Employee Self-Care App (React Native + Expo)

This is a mobile self-service application for employees, built with **React Native (Expo)**. It connects to the existing PHP-based HRoS backend and provides access to personal data, attendance,cash advance , leave, payroll, and document.

---

## 🚀 Features

- 🔐 **Login Screen**
  - Username & password login via API
  - Persistent session using AsyncStorage

- 🏠 **Dashboard**
  - Welcome block with employee info
  - Attendance summary
  - Announcements and upcoming holidays
  - Quick navigation grid

- 📆 **Attendance**
  - Monthly attendance view
  - Clock-in / clock-out history

- 🛏️ **Leave**
  - View leave balances
  - Leave history with status
  - Apply leave modal (iOS-style slide-up)

- 💰 **Payroll**
  - Monthly/annual salary
  - Payslip viewer
  - Salary structure & benefits

- 👤 **Profile**
  - Tabbed employee info
  - Personal data view/edit
  - Experience & documents (read-only)

- 📂 **Documents**
  - Auto-fetch employee documents (image/PDF)
  - Image preview
  - PDF open in browser
  - File download & sharing via device

---

## ⚙️ Tech Stack

- **React Native + Expo SDK 53**
- **TypeScript**
- **Axios** for API requests
- **AsyncStorage** for session
- **Expo FileSystem + Sharing** for document access
- **Lottie** for animations (planned for onboarding)
- **expo-router** for routing & screen navigation

---

## 📡 API Integration

This app connects to the PHP HRoS backend via REST endpoints:



