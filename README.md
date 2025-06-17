# HRoS Employee Self-Care App x (React Native + Expo)

This is a mobile self-service application for employees, built with **React Native (Expo)**. It connects to the existing PHP-based HRoS backend and provides access to personal data, attendance,cash advance , leave, payroll, and document.

---#

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



## 🔑 Updating iOS Credentials

If you encounter a **"Verification Failed"** message when installing the iOS `.ipa`, you may need to refresh the signing credentials and rebuild. The project now includes the [EAS CLI](https://docs.expo.dev/eas/credentials/) as a development dependency to streamline this process.

Run the following commands:

```bash
# Install dependencies (if not already installed)
npm install

# Update the stored iOS credentials
npm run update-credentials

# Rebuild the iOS application using the production profile
npm run ios
```

The `update-credentials` script opens the EAS credentials manager where you can upload new certificates or provisioning profiles. After updating, rebuilding the app will produce a new `.ipa` that can be installed without verification issues.

