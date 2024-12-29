# Wedding Sparks

## Overview
Wedding Sparks is a web application designed to seamlessly connect customers with vendors to plan and execute weddings. It provides a platform for vendors to list their services and customers to book vendors for their wedding events. The application offers features such as vendor categorization, profile management, booking system, and payment integration.

## Features
- **Customer and Vendor Roles:** Separate user roles with distinct functionalities.
- **Vendor Listings:** Vendors can create and manage listings for their services.
- **Bookings:** Customers can book vendors for specific dates, with overlap prevention.
- **Payment Integration:** Secure and efficient payment processing for bookings.
- **Profile Management:** Unified profile page for both customers and vendors.
- **Dashboard:** Intuitive dashboards displaying bookings, payments, and status updates.

## Tech Stack
### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Icons:** React Icons

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT)
- **Patment Method:** Razorpay

### Deployment
- **Frontend:** Vercel
- **Backend:** Vercel

## Installation
### Prerequisites
Ensure the following are installed on your system:
- Node.js (v14+)
- MongoDB
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wedding-sparks
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add the following:
     ```env
     PORT=3000
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-secret-key>
     ```
   - For the frontend, create a `.env` file in the `client` directory and add:
     ```env
     VITE_API_BASE_URL=<your-backend-url>
     ```

4. Run the application:
   - Backend:
     ```bash
     npm run dev
     ```
   - Frontend:
     ```bash
     cd client
     npm run dev
     ```

5. Open the application in your browser at `http://localhost:5173`.
Project Screenshots:

1. Home Screen
   ![Screenshot 2024-12-29 154941](https://github.com/user-attachments/assets/051c7f88-65f7-4412-b234-ddd1ae119682)

2. Search using Categories
![Screenshot 2024-12-29 154959](https://github.com/user-attachments/assets/2f4bf49b-84b2-4aee-a91d-6b59617f2830)

3. Service Page
   ![Screenshot 2024-12-29 155052](https://github.com/user-attachments/assets/f5ee7280-0820-476f-a6c7-b149c6ce1e70)
   ![Screenshot 2024-12-29 155127](https://github.com/user-attachments/assets/fd0e9d88-21a1-405e-be2d-3c146b4e41a0)

4. Customers Reviews:
   ![Screenshot 2024-12-29 155141](https://github.com/user-attachments/assets/4afe64d3-1656-4861-8f90-7aa516b4e564)

5. Dashboard (Customer & Vendor)
   ![Screenshot 2024-12-29 155152](https://github.com/user-attachments/assets/027e4544-bf9e-454d-aa13-6e004760da6c)
![Screenshot 2024-12-29 155243](https://github.com/user-attachments/assets/74c88484-ff76-4946-bda9-45c84aeb4580)

6. Listing Page:
  ![Screenshot 2024-12-29 155301](https://github.com/user-attachments/assets/94f6c699-d235-4cb9-889c-bdabf5e37213)

7. Profile:
   ![Screenshot 2024-12-29 155317](https://github.com/user-attachments/assets/09a18b45-19a3-48ad-ba64-93ef4840bd97)

   
## Contact
For queries or contributions, reach out at:
- Email: rahuldhakad201.rd@gmail.com
- GitHub: [githubRahuld](https://github.com/githubRahuld)

