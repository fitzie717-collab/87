# Firebase Studio - ContentMix

This is a Next.js starter application built in Firebase Studio. It's designed as a comprehensive dashboard for content analysis, attribution, and media buying.

## Getting Started

To get the application running on your local machine, follow these steps.

### 1. Install Dependencies

First, you need to install all of the required packages for the project. Open your terminal in the root directory of the project and run the following command:

```bash
npm install
```

This will download and install all the necessary dependencies listed in the `package.json` file.

### 2. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server. This will also start the Genkit AI flows.

```bash
npm run dev
```

The application should now be running, and you can open [http://localhost:9002](http://localhost:9002) in your browser to see it. Any changes you make to the code will automatically reload the application.

## Troubleshooting

### "Cannot find module" Error

If you encounter an error like `Cannot find module '@genkit-ai/googleai' or its corresponding type declarations`, it usually means your installed packages are out of sync. This can happen even if `npm install` completes successfully, as your code editor might not have picked up the changes. To fix this, you must perform a clean re-installation of your dependencies.

1.  **Delete the `node_modules` folder** in your project directory.
2.  **Delete the `package-lock.json` file** in your project directory.
3.  **Run the installation command again:**

    ```bash
    npm install
    ```
4. **Restart your code editor** to ensure it recognizes the newly installed packages. This is a crucial step.

This process will rebuild your dependency tree from scratch and should resolve the issue.

## Deployment to Firebase

To publish your application and make it available on a public URL, you'll use the Firebase CLI.

### 1. Install the Firebase CLI

If you don't have it installed already, run this command in your terminal. You only need to do this once.

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

This will open a browser window and ask you to log in with your Google account.

```bash
firebase login
```

### 3. Build the Project

Create an optimized production build of your Next.js application.

```bash
npm run build
```

### 4. Deploy the Application

This command will upload your project to Firebase App Hosting. When it's finished, it will give you a public URL where you can see your live application.

```bash
firebase deploy --only apphosting
```
