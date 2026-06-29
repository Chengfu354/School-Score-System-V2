# Google Sheet Schema & Mapping Document

This document outlines the exact Google Sheet structure and column mapping for **School Score System V2**.

## 1. Sheet Tabs
1. `Scores` (Main score matrix and automated formulas)
2. `AuditLog` (Audit trail log recording all score modifications)

---

## 2. Main Sheet Structure (`Scores`)

| Column Letter | Header Title | Data Type / Formula | Example / Notes |
| :--- | :--- | :--- | :--- |
| **Col A** | `No.` | Integer | 1 to 36 |
| **Col B** | `Student ID` | String / Text | `2666` to `2701` |
| **Col C** | `Full Name` | Khmer String | `សែម ធារ៉ា` |
| **Col D** | `Gender` | String (`M` / `F`) | `M` or `F` |
| **Col E – Y**| `Subjects (21 Cols)` | Numeric (0 - 100) | `ស្ដាប់`, `សរសេរ`, `អាន`, `ចំនួន`, etc. |
| **Col Z** | `Total Score` | Formula `=SUM(E3:Y3)` | Total aggregated score |
| **Col AA** | `Average` | Formula `=AVERAGE(E3:Y3)` | Class Average score |
| **Col AB** | `Rank` | Formula `=RANK(Z3, Z$3:Z$38)` | Automatic class ranking |
| **Col AC** | `Grade` | Formula `=IF(AA3>=90,"A",IF(AA3>=80,"B",IF(AA3>=70,"C",IF(AA3>=60,"D",IF(AA3>=50,"E","F")))))` | Ministry Grade evaluation |

---

## 3. Audit Log Sheet Structure (`AuditLog`)

| Column Letter | Header Title | Description |
| :--- | :--- | :--- |
| **Col A** | `Timestamp` | Date and Time of edit |
| **Col B** | `Student ID` | Target student identification number |
| **Col C** | `Action / Subject` | Modified subject or action type |
| **Col D** | `Old Score` | Previous value prior to change |
| **Col E** | `New Score` | Updated value post change |
| **Col F** | `Modified By` | User name or Telegram handle |
