export function welcomeEmail (name: string, userId:string,hash: string){
    const email = `<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 80%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #1e90ff;
            /* Blue */
        }

        p {
            color: #333333;
            /* Black */
        }

        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1e90ff;
            /* Blue */
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            margin-top: 20px;
            color: #666666;
            /* Gray */
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Welcome to OpenHouses!</h1>
        <p>Dear ${name},</p>
        <p>We are thrilled to welcome you to OpenHouses. Our team is dedicated to providing you with the best
            assistance and support for your needs.</p>
        <p>Feel free to explore our services and don't hesitate to reach out if you have any questions or need
            assistance. We're here to help!</p>
        <a class="button" style='color: #fff;' href="https://openhouses.ie/auth/activate/${userId}/${hash}">Activate my
            account now.</a>
        <p class="footer">Best regards,<br />The OpenHouses Team</p>
    </div>
</body>

</html>`
return email
}

export function userActivationEmail (name: string){
    const email = `<!DOCTYPE html>
    <html>
    
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                width: 80%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #1e90ff;
                /* Blue */
            }
    
            p {
                color: #333333;
                /* Black */
            }
    
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #1e90ff;
                /* Blue */
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
    
            .footer {
                margin-top: 20px;
                color: #666666;
                /* Gray */
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h1>Your Account Has Been Successfully Activated!</h1>
            <p>Dear ${name},</p>
            <p>We are excited to inform you that your account has been successfully activated at OpenHouses. You are now
                ready to enjoy all the benefits and services we offer.</p>
            <p>Feel free to explore our platform and utilize our services. If you have any questions or need assistance,
                please don't hesitate to contact us.</p>
            <a class="button" style='color: #fff;' href="https://openhouses.ie/auth/signin">Login to OpenHouses</a>
            <p class="footer">Best regards,<br />The OpenHouses Team</p>
        </div>
    </body>
    
    </html>
    `
return email
}

export function recoveryEmail(resetToken: string) {
    const email = `<!DOCTYPE html>
    <html>
    
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                width: 80%;
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #1e90ff;
                /* Blue */
            }
    
            p {
                color: #333333;
                /* Black */
            }
    
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #1e90ff;
                /* Blue */
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
    
            .footer {
                margin-top: 20px;
                color: #666666;
                /* Gray */
            }
        </style>
    </head>
    
    <body>
        <div class="container">
            <h1>Password Recovery</h1>
            <p>Dear User,</p>
            <p>You have requested to reset your password for OpenHouses account.</p>
            <p>To reset your password, please click on the following link:</p>
            <a class="button" style='color: #fff;' href="https://openhouses.ie/auth/changepassword/${resetToken}">Reset Password</a>
            <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
            <p class="footer">Best regards,<br />The OpenHouses Team</p>
        </div>
    </body>
    
    </html>
    `

    return email
}