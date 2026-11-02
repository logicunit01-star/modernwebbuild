const sharp = require('sharp');
const fs = require('fs');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Subtle grid decorative lines -->
  <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
    <line x1="80" y1="0" x2="80" y2="630"/>
    <line x1="1120" y1="0" x2="1120" y2="630"/>
    <line x1="0" y1="80" x2="1200" y2="80"/>
    <line x1="0" y1="550" x2="1200" y2="550"/>
  </g>

  <!-- Inner editorial card -->
  <rect x="80" y="80" width="1040" height="470" rx="20" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>

  <!-- Category Tag -->
  <g transform="translate(140, 150)">
    <rect width="250" height="38" rx="8" fill="rgba(37,99,235,0.2)" stroke="rgba(59,130,246,0.5)" stroke-width="1"/>
    <text x="125" y="24" fill="#60a5fa" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="2" text-anchor="middle">TECHNICAL JOURNAL</text>
  </g>

  <!-- Brand Title -->
  <text x="140" y="260" fill="#ffffff" font-family="Georgia, Cambria, serif" font-size="64" font-weight="800" letter-spacing="-1.5">Modernwebbuild</text>
  <text x="140" y="325" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400">Guides on Headless CMS, Web Architecture &amp; Scalable Builds</text>

  <!-- Accent Divider line -->
  <rect x="140" y="380" width="140" height="4" rx="2" fill="url(#accent)"/>

  <!-- Metadata pills -->
  <g transform="translate(140, 440)">
    <text x="0" y="20" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500">Next.js App Router</text>
    <text x="190" y="20" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="18">•</text>
    <text x="215" y="20" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500">Headless Architecture</text>
    <text x="430" y="20" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="18">•</text>
    <text x="455" y="20" fill="#cbd5e1" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="500">Engineering Playbooks</text>
  </g>

  <!-- Domain watermark on bottom right -->
  <text x="1040" y="460" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" text-anchor="end">modernwebbuild.com</text>
</svg>
`;

sharp(Buffer.from(svg))
  .png()
  .toFile('public/images/og-image.png')
  .then(info => {
    console.log('OG image created successfully:', info);
  })
  .catch(err => {
    console.error('Error generating OG image:', err);
    process.exit(1);
  });
