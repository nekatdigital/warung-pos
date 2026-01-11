/**
 * Validation Utilities
 * Provides input validation and error handling
 */
import type { OrderItemPayload } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate product input
 */
export function validateProduct(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Product name is required' });
  }

  if (typeof data.price !== 'number' || data.price <= 0) {
    errors.push({ field: 'price', message: 'Price must be greater than 0' });
  }

  if (!data.product_type || !['OWN_PRODUCTION', 'RESELL', 'CONSIGNMENT'].includes(data.product_type)) {
    errors.push({ field: 'product_type', message: 'Invalid product type' });
  }

  if (data.product_type === 'CONSIGNMENT' && !data.vendor_id) {
    errors.push({ field: 'vendor_id', message: 'Vendor is required for consignment products' });
  }

  return errors;
}

/**
 * Validate category input
 */
export function validateCategory(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Category name is required' });
  }

  return errors;
}

/**
 * Validate vendor input
 */
export function validateVendor(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Vendor name is required' });
  }

  if (data.phone && !/^[0-9+\-\s()]*$/.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number format' });
  }

  return errors;
}

/**
 * Validate payment input
 */
export function validatePayment(
  cashReceived: number,
  totalAmount: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Number.isFinite(cashReceived) || cashReceived < 0) {
    errors.push({ field: 'cashReceived', message: 'Invalid amount entered' });
  }

  if (cashReceived < totalAmount) {
    errors.push({
      field: 'cashReceived',
      message: `Insufficient payment. Need Rp ${(totalAmount - cashReceived).toLocaleString('id-ID')} more`,
    });
  }

  return errors;
}

/**
 * Validate order data
 */
export function validateOrder(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.total_amount || typeof data.total_amount !== 'number' || data.total_amount <= 0) {
    errors.push({ field: 'total_amount', message: 'Order total must be greater than 0' });
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push({ field: 'items', message: 'Order must contain at least one item' });
  } else {
    data.items.forEach((item: OrderItemPayload, index: number) => {
      if (!item.product_id || typeof item.product_id !== 'string') {
        errors.push({ field: `items[${index}].product_id`, message: 'Product ID is required' });
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantity must be a positive number' });
      }
      if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
        errors.push({ field: `items[${index}].unit_price`, message: 'Unit price must be a non-negative number' });
      }
      // Security: Ensure subtotal is not manipulated client-side
      const expectedSubtotal = (item.unit_price || 0) * (item.quantity || 0);
      if (typeof item.subtotal !== 'number' || item.subtotal !== expectedSubtotal) {
        errors.push({ field: `items[${index}].subtotal`, message: `Subtotal must be unit_price * quantity` });
      }
    });
  }

  if (data.cash_received && typeof data.cash_received !== 'number') {
    errors.push({ field: 'cash_received', message: 'Invalid cash amount' });
  }

  return errors;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((e) => `${e.field}: ${e.message}`).join('\n');
}

/**
 * Check if there are any validation errors
 */
export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}

/**
 * Get first error message for a specific field
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

/**
 * Safe number parsing
 */
export function parseNumber(value: any, defaultValue: number = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : defaultValue;
}

/**
 * Safe string parsing
 */
export function parseString(value: any, defaultValue: string = ''): string {
  return typeof value === 'string' ? value.trim() : defaultValue;
}

/**
 * Sanitize user input (prevent XSS)
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
