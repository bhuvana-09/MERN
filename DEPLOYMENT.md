# Deployment Guide

This guide describes how to deploy the **Subscription Overload Manager** application to production using a **Split Deployment** architecture:
- **Frontend**: Deployed on **Vercel** (Static Site Hosting)
- **Backend API**: Deployed on **Render** (Web Service Hosting)
- **Database**: Deployed on **MongoDB Atlas** (Managed Cloud Database)

---

## 1. Database Setup (MongoDB Atlas)

1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (e.g., `Cluster0`).
3. Under **Database Access**, create a database user with read/write privileges (note the username and password).
4. Under **Network Access**, add an IP entry `0.0.0.0/0` to allow connections from Render (or restrict to Render's IP addresses).
5. Navigate to **Database** -> click **Connect** on your cluster -> select **Drivers** (Node.js).
6. Copy the connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority`

---

## 2. Backend Deployment (Render)

1. Sign up/log in to [Render](https://render.com/).
2. Click **New** -> **Web Service**.
3. Connect your Git repository (GitHub/GitLab).
4. Configure the Web Service settings:
   - **Name**: `subscription-manager-backend`
   - **Root Directory**: `backend` (Important: points to the backend folder)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (runs `node server.js`)
5. Click **Advanced** and add the following **Environment Variables**:
   - `PORT`: `5000` (Render will override this, but good practice to define)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/subscription-manager?retryWrites=true&w=majority` (your Atlas string)
   - `JWT_SECRET`: `your_production_secure_jwt_key` (generate a secure random key)
   - `CLIENT_URL`: `https://your-frontend-vercel-url.vercel.app` (you will update this once the Vercel site is deployed)
6. Click **Create Web Service**. Render will build and deploy your API. Once deployed, note down the backend API URL (e.g., `https://subscription-manager-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Sign up/log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project**.
3. Select your Git repository.
4. Configure the project:
   - **Project Name**: `subscription-manager-frontend`
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `frontend` (Important: points to the frontend folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://subscription-manager-backend.onrender.com/api` (the URL of your Render API with `/api` appended)
6. Click **Deploy**. Vercel will build the frontend and provide a public deployment URL (e.g., `https://subscription-manager-frontend.vercel.app`).

---

## 4. Finalizing CORS configuration

1. Now that your frontend has a live URL from Vercel, copy it.
2. Go back to your Render backend web service dashboard.
3. Under **Environment Variables**, update the `CLIENT_URL` variable to match your Vercel URL exactly (e.g., `https://subscription-manager-frontend.vercel.app`).
4. Save the changes. Render will automatically redeploy the backend with the new CORS origin allowed.

---

## 5. Troubleshooting & Checks

- **CORS Errors**: If you encounter CORS issues in the console, verify that `CLIENT_URL` in Render matches your Vercel URL exactly, with no trailing slashes.
- **Path Routing Errors (404 on refresh)**: The [vercel.json](file:///d:/subscription-manager/frontend/vercel.json) file handles SPA routing. If refreshing pages like `/dashboard` returns a 404, verify that `vercel.json` exists in the frontend root directory.
- **Failed Builds (ESLint)**: If Vercel fails to deploy because of lint errors, make sure you ran `npm run lint` locally and resolved all errors before pushing.
