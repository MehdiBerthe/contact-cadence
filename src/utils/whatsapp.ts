/**
 * Generate WhatsApp deep link with prefilled message
 * @param e164 Phone number in E.164 format (e.g., "+1234567890")
 * @param text Message text to prefill
 * @returns WhatsApp wa.me URL
 */
export function createWhatsAppLink(e164: string, text: string): string {
  // Remove any non-digit characters from phone number
  const cleanPhone = e164.replace(/\D/g, '');
  
  // Encode the message text for URL
  const encodedText = encodeURIComponent(text);
  
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Open WhatsApp with prefilled message in new tab
 * @param e164 Phone number in E.164 format
 * @param text Message text to prefill
 */
export function openWhatsApp(e164: string, text: string): void {
  const link = createWhatsAppLink(e164, text);
  window.open(link, '_blank');
}