import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { type Match } from '@/lib/supabase';
import { type DigestFrequency } from '@/lib/email';

interface AlertDigestProps {
  matches: Match[];
  frequency: DigestFrequency;
  userName: string;
}

export function AlertDigest({ matches, frequency, userName }: AlertDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your {frequency} Craigslist alert digest - {String(matches.length)} new matches
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            Hi {userName},
          </Heading>
          
          <Text style={text}>
            Here are your latest Craigslist matches from the past {frequency === 'daily' ? '24 hours' : 'week'}:
          </Text>

          <Section style={matchesContainer}>
            {matches.map((match) => (
              <div key={match.id} style={matchCard}>
                <Link href={match.url} style={matchTitle}>
                  {match.title}
                </Link>
                {match.price && (
                  <Text style={price}>${match.price}</Text>
                )}
                <Text style={location}>{match.location}</Text>
                <Text style={date}>
                  Posted: {new Date(match.posted_at).toLocaleDateString()}
                </Text>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            View all matches in your{' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/app/results`}>
              dashboard
            </Link>
            . To change your email preferences, visit your{' '}
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/app/settings`}>
              settings
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 24px',
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px',
};

const matchesContainer = {
  margin: '24px 0',
};

const matchCard = {
  borderRadius: '4px',
  border: '1px solid #e6e6e6',
  padding: '16px',
  marginBottom: '16px',
};

const matchTitle = {
  color: '#0066cc',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
};

const price = {
  color: '#2d862d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '8px 0',
};

const location = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0',
};

const date = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '24px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.5',
};
