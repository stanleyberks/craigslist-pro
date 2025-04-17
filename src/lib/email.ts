import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { AlertDigest } from '@/emails/alert-digest';
import { supabase } from './supabase';
import type { Match } from './supabase';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export type DigestFrequency = 'daily' | 'weekly' | 'instant';

export async function sendAlertDigest(
  userId: string,
  frequency: DigestFrequency,
  matches: Match[]
) {
  try {
    // Get user's email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('user_id', userId)
      .single();

    if (!profile?.email) {
      throw new Error('User email not found');
    }

    // Render email HTML
    const emailHtml = render(
      AlertDigest({
        matches,
        frequency,
        userName: profile.full_name,
      })
    );

    // Send email
    const emailHtmlString = await emailHtml;
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: profile.email,
      subject: `Your ${frequency} Craigslist Alert Digest`,
      html: emailHtmlString,
    });

    // Update last_digest_sent
    await supabase
      .from('profiles')
      .update({ last_digest_sent: new Date().toISOString() })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Error sending digest:', error);
    throw error;
  }
}
