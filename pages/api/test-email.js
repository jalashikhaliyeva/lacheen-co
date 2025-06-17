import emailjs from '@emailjs/browser';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
    return res.status(500).json({ 
      message: 'Email configuration missing',
      error: 'EmailJS credentials not configured',
      config: {
        hasServiceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        hasTemplateId: !!process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        hasPublicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      }
    });
  }

  try {
    const templateParams = {
      to_email: 'jala.shikhaliyeva@gmail.com',
      message: 'This is a test email from Lacheen website',
      subject: 'Test Email'
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    );

    res.status(200).json({ 
      message: 'Test email sent successfully',
      response
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      message: 'Error sending test email',
      error: error.message,
      details: error
    });
  }
} 