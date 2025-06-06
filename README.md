# HRMS Employee Self-Care App (React Native + Expo)

This is a mobile self-service application for employees, built with **React Native (Expo)**. It connects to the existing PHP-based HRMS backend and provides access to personal data, attendance, leave, payroll, and documents.

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

This app connects to the PHP HRMS backend via REST endpoints:

- `auth/login.php` → Login
- `employees/index.php?emp_no=...` → Employee info
- `leaves/balances.php` → Leave balance
- `leaves/index.php` → Leave history
- `document/index.php?emp_no=...` → Documents (image/pdf)
- `settings/index.php?type=notices|holidays` → Dashboard data

All endpoints are hosted under:  
`https://api.rccmaldives.com/ess/`

Document files are served from:  
`https://hros.rccmaldives.com/assets/document/`

---

## 🛠️ Setup

### 1. Clone this repo

```bash
git clone https://github.com/your-username/hrms-employee-app.git
cd hrms-employee-app
