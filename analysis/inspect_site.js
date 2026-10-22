const fs = require('fs');

const content = fs.readFileSync('C:\\Users\\youba\\.gemini\\antigravity-ide\\brain\\9a3d07cd-e86f-4aed-893f-dacda521e6f4\\.system_generated\\steps\\24\\content.md', 'utf8');

// Find sections
const sectionMatches = [...content.matchAll(/<section[^>]*id=["']([^"']+)["'][^>]*>/g)].map(m => m[1]);
console.log('Sections:', sectionMatches);

// Find headings
const hMatches = [...content.matchAll(/<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => {
  return `${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`;
});
console.log('\nHeadings:');
console.log(hMatches.join('\n'));

// Find links
const links = [...content.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => {
  return `${m[1]} -> ${m[2].replace(/<[^>]+>/g, '').trim()}`;
}).filter(l => l.length > 5);
const uniqueLinks = [...new Set(links)];
console.log('\nUnique Links (' + uniqueLinks.length + '):');
console.log(uniqueLinks.slice(0, 40).join('\n'));

// Pricing or plans
const pricingMatches = [...content.matchAll(/(\$\d+|\/month|\/year|credits?|unlimited|lifetime|free tier|pro|starter)/gi)].map(m => m[0]);
console.log('\nPricing keywords found:', pricingMatches.slice(0, 30));
