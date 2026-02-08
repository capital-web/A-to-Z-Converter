
// Import React to ensure the React namespace is available for React.ReactNode
import React from 'react';

export enum ToolType {
  BASIC_CALC = 'Basic Calculator',
  SCIENTIFIC_CALC = 'Scientific Calculator',
  EMI_CALC = 'EMI Calculator',
  FINANCIAL_CALC = 'Financial Calculator',
  AGE_CALC = 'Age Calculator',
  CURRENCY_COUNTER = 'Currency Counter',
  NUMBER_WORDS = 'Number to Words',
  DAY_COUNTER = 'Day Counter',
  DATE_OFFSET_CALC = 'Date Offset Calculator',
  PERCENT_FINDER = 'Percentage Finder',
  GST_CALC = 'GST Calculator',
  HSN_FINDER = 'HSN Code Finder',
  MEASUREMENT = 'Unit Converter',
  TEXT_CONVERTER = 'Text Converter',
  FANCY_TEXT = 'Fancy Font Generator',
  INDIC_KEYBOARD = 'Indic Language Keyboard',
  QR_GENERATOR = 'QR Code Generator',
  LINK_SHORTENER = 'Link Shortener',
  WHATSAPP_LINK = 'WhatsApp Link Generator',
  SEO_META_GEN = 'SEO Meta Tag Generator',
  FAKE_ADDRESS_GEN = 'Fake Address Generator',
  HISTORY = 'Cloud Records',
  ADMIN = 'Admin Panel'
}

export interface NavItem {
  id: ToolType;
  icon: React.ReactNode;
  description: string;
}
