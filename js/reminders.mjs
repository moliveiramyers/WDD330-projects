fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_SENDGRID_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: memberEmail }] }],
    from: { email: 'your@domain.com' },
    subject: 'Upcoming Event Reminder',
    content: [{ type: 'text/plain', value: 'You have an upcoming event...' }]
  })
});
