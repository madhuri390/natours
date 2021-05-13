const nodemailer = require('nodemailer');
const pug = require('pug');
const htmltoText = require('html-to-text');
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }
  newTransport() {
    console.log(process.env.NODE_ENV);
    //if (process.env.NODE_ENV === 'production') {
    //Send grid
    console.log('yes in production');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'veeramreddymadhuri9@gmail.com',
        pass: '11_venkat',
      },
    });
    //}
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     // eslint-disable-next-line prettier/prettier
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }
  async send(template, subject) {
    //Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmltoText.fromString(html),
      // html:
    };

    //Create a transport and send mail
    console.log(this.newTransport);
    await this.newTransport().sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours Family');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Reset your password (Valid only for 10 min)'
    );
  }
};
