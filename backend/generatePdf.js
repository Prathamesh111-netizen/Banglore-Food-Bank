import PDFDocument from "pdfkit";
import fs from "fs";

const generatePDF = (name, email, orderID) => {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4"
  });

  // Helper to move to next line
  function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }

  doc.pipe(fs.createWriteStream(`CertificateOfDonation-${orderID}.pdf`));

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");

  doc.fontSize(10);

  // Margin
  const distanceMargin = 18;

  doc
    .fillAndStroke("#0e8cc3")
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();

  // Header
  const maxWidth = 140;
  const maxHeight = 70;

  doc.image("assets/winners.png", doc.page.width / 2 - maxWidth / 2, 60, {
    fit: [maxWidth, maxHeight],
    align: "center"
  });

  jumpLine(doc, 5);

  doc
    .fontSize(10)
    .fill("#021c27")
    .text("Doantion to Community", {
      align: "center"
    });

  jumpLine(doc, 2);

  
  doc
    .fontSize(16)
    .fill("#021c27")
    .text("CERTIFICATE OF Donation", {
      align: "center"
    });

  jumpLine(doc, 1);

  doc
    .fontSize(10)
    .fill("#021c27")
    .text("This is to certify that ", {
      align: "center"
    });

  jumpLine(doc, 2);

  doc
    .fontSize(24)
    .fill("#021c27")
    .text(`${name}`, {
      align: "center"
    });

  jumpLine(doc, 1);
  const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
  };
  doc
    .fontSize(10)
    .fill("#021c27")
    .text(
      // `has successfully completed the ${course} on ${new Date(
      //   Date.now()
      // ).toLocaleDateString()}.`
      `has successfully donated on ${new Date(Date.now()).getDate()} ${
        months[new Date(Date.now()).getMonth()]
      }, ${new Date(Date.now()).getFullYear()}.`,
      {
        align: "center"
      }
    );

  jumpLine(doc, 7);

  doc.lineWidth(1);

  // Signatures
  const lineSize = 154;
  const signatureHeight = 450;

  doc.fillAndStroke("#021c27");
  doc.strokeOpacity(0.2);

  const startLine1 = 208;
  const endLine1 = 198 + lineSize;
  doc
    .moveTo(startLine1, signatureHeight)
    .lineTo(endLine1, signatureHeight)
    .stroke();
  doc.image("assets/ach.jpg", startLine1 + 405, 50, {
    fit: [100, 100],
    align: "left",
    height: 250,
    width: 200
  });
  doc.image("assets/sergio1.png", startLine1 + 20, 370, {
    fit: [maxWidth, maxHeight],
    align: "left"
  });
  doc.image("assets/raquel.png", startLine1 + 315, 370, {
    fit: [maxWidth, maxHeight],
    align: "left"
  });

  const startLine2 = endLine1;
  const endLine2 = startLine2 + lineSize;
  doc
    .moveTo(startLine2, signatureHeight)
    .lineTo(endLine2, signatureHeight)
    .stroke();

  const startLine3 = endLine2;
  const endLine3 = startLine3 + lineSize;
  doc
    .moveTo(startLine3, signatureHeight)
    .lineTo(endLine3, signatureHeight)
    .stroke();
  doc
    .fontSize(10)
    .fill("#021c27")
    .text("Prathamesh Pawar", startLine1, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center"
    });

  doc
    .fontSize(10)
    .fill("#021c27")
    .text("Founder", startLine1, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center"
    });

    doc
    .fontSize(10)
    .fill("#021c27")
    .text("Yash Pabari", startLine2, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  doc
    .fontSize(10)
    .fill("#021c27")
    .text("Volunteer Lead", startLine2, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  doc
    .fontSize(10)
    .fill("#021c27")
    .text("Harsh Patil", startLine3, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center"
    });

  doc
    .fontSize(10)
    .fill("#021c27")
    .text("Secretary, banglore Food Bank", startLine3, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center"
    });

  jumpLine(doc, 4);

 
  doc
    .fontSize(10)
    .fill("#021c27")


  doc.end();

  //  Mail
  const output = `
      <h2>Thank you for donating!</h2>
    <p>Because you we will be able to feed more people</h3>
    <p>Banglore food bank</p>
  `;
  // // create reusable transporter object using the default SMTP transport
  // let transporter = nodemailer.createTransport({
  //   // host: "smtp.ethereal.email",
  //   port: 587,
  //   secure: false, // true for 465, false for other ports
  //   auth: {
  //     user: `${process.env.FSS_EMAIL}`, // generated ethereal user
  //     pass: `${process.env.FSS_PASSWORD}` // generated ethereal password
  //   },
  //   // If on localhost
  //   tls: {
  //     rejectUnauthorized: false
  //   },
  //   service: "gmail"
  // });

  // send mail with defined transport object
  // let mailOptions = {
  //   // from: '"Nodemailer Testing" <raj.sanghavi1@svkmmumbai.onmicrosoft.com>', // sender address
  //   from: "Banglore Food Bank",
  //   to: email, // list of receivers
  //   subject: "Successful Donation ✔", // Subject line
  //   // text: "Hello world?", // plain text body
  //   // html: "<b>Hello world?</b>", // html body
  //   html: output,
  //   attachments: [
  //     {
  //       path: "./CertificateOfDonation.pdf"
  //     }
  //   ]
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     // res.json(error);
  //   } else {
  //     console.log("Message sent: %s", info.messageId);
  //     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  //     // res.status(200).json({
  //     //   success: true,
  //     //   emailSuccess: true,
  //     //   data: user,
  //     // });
  //   }
  // });
  return doc
};

// generatePDF("raj", "REACT COURSE");
export default generatePDF;
