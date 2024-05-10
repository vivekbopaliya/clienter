# React file manager

## Getting Started

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/vivekbopaliya/clienter.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory of the project and paste the following environment variables, filling in the values appropriately:

    ```plaintext
    DATABASE_URL=your_database_url_here
    NEXT_PUBLIC_JWT_SECRET=your_jwt_secret_here
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
    NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key_here
    NEXT_PUBLIC_CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
    ```

    **Note:** Ensure you have set up a MongoDB database and have an account on Cloudinary to obtain these credentials.

4. Create a folder named `filse` not `files` inside your Cloudinary account as all the files will be stored in this folder.

## Running the Application

To run the application in development mode, execute the following command:

```bash
npm run dev
```

And you are good to go.

## Live Demo:
Check out the live demo and auth error handling of this app [here]('https://drive.google.com/drive/folders/1PKH5ra2OI_TwMfwsVA28ihXHrfSheoSQ?usp=drive_link').