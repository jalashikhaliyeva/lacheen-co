import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Email configuration missing:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPassword: !!process.env.EMAIL_PASSWORD,
      emailUser: process.env.EMAIL_USER ? 'set' : 'not set',
      emailPassword: process.env.EMAIL_PASSWORD ? 'set' : 'not set'
    });
    return res.status(500).json({ 
      message: 'Email configuration missing',
      error: 'Email credentials not configured',
      details: {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_PASSWORD
      }
    });
  }

  try {
    const orderData = req.body;

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      debug: true // Enable debug output
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email configuration verified successfully');
    } catch (verifyError) {
      console.error('Transporter verification failed:', {
        error: verifyError.message,
        code: verifyError.code,
        command: verifyError.command
      });
      return res.status(500).json({ 
        message: 'Email service configuration error',
        error: verifyError.message,
        details: {
          code: verifyError.code,
          command: verifyError.command
        }
      });
    }

    const {
      userInfo,
      items,
      deliveryDetails,
      payment,
      total,
      subtotal,
      deliveryFee,
      createdAt
    } = orderData;

    // Format the items list
    const itemsList = items.map(item => `
      - ${item.name}
        Quantity: ${item.quantity}
        Price: ${item.price} ₼
        Size: ${item.size}
        Color: ${item.color}
    `).join('\n');

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'jala.shikhaliyeva@gmail.com',
      subject: 'New Order Received',
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order Date:</strong> ${new Date(createdAt).toLocaleString()}</p>
        
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${userInfo.name}</p>
        <p><strong>Email:</strong> ${userInfo.email}</p>
        <p><strong>Phone:</strong> ${userInfo.phone}</p>
        
        <h3>Delivery Address:</h3>
        <p>${userInfo.address}</p>
        <p>${userInfo.city}, ${userInfo.postalCode}</p>
        
        <h3>Delivery Details:</h3>
        <p><strong>Time Range:</strong> ${deliveryDetails.timeRange}</p>
        <p><strong>Description:</strong> ${deliveryDetails.description || 'No description provided'}</p>
        
        <h3>Order Items:</h3>
        <pre>${itemsList}</pre>
        
        <h3>Payment Information:</h3>
        <p><strong>Method:</strong> ${payment.method}</p>
        <p><strong>Amount:</strong> ${payment.amount} ₼</p>
        
        <h3>Order Summary:</h3>
        <p><strong>Subtotal:</strong> ${subtotal} ₼</p>
        <p><strong>Delivery Fee:</strong> ${deliveryFee} ₼</p>
        <p><strong>Total:</strong> ${total} ₼</p>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error sending email', 
      error: error.message,
      details: {
        code: error.code,
        command: error.command
      },
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 