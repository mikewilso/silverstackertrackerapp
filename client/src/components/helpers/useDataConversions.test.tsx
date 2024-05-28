import { convertToOzt, convertToOz, convertToGrams, formatDate } from './useDataConversions';
import moment from 'moment';

describe('convertToOzt', () => {
    it('should convert grams to ozt', () => {
        const result = convertToOzt(31.104, 'grams');
        expect(result).toBeCloseTo(1);
    });

    it('should convert oz to ozt', () => {
        const result = convertToOzt(1, 'oz');
        expect(result).toBeCloseTo(1.09714);
    });

    it('should return the same weight for other types', () => {
        const result = convertToOzt(1, 'other');
        expect(result).toBe(1);
    });
});


describe('convertToOz', () => {
    it('should convert grams to oz', () => {
        const result = convertToOz(28.35, 'grams');
        expect(result).toBeCloseTo(1);
    });

    it('should convert ozt to oz', () => {
        const result = convertToOz(1, 'ozt');
        expect(result).toBeCloseTo(1.09714);
    });

    it('should return the same weight for other types', () => {
        const result = convertToOz(1, 'other');
        expect(result).toBe(1);
    });
});

describe('convertToGrams', () => {
    it('should convert oz to grams', () => {
        const result = convertToGrams(1, 'oz');
        expect(result).toBeCloseTo(28.35);
    });

    it('should convert ozt to grams', () => {
        const result = convertToGrams(1, 'ozt');
        expect(result).toBeCloseTo(31.104);
    });

    it('should return the same weight for other types', () => {
        const result = convertToGrams(1, 'other');
        expect(result).toBe(1);
    });
});

describe('formatDate', () => {
    it('should format date string to YYYY-MM-DD', () => {
        const date = moment('2022-01-01T00:00:00').toISOString();
        const result = formatDate(date);
        expect(result).toBe('2022-01-01');
    });

    it('should return the same date for invalid date strings', () => {
        const date = 'invalid date';
        const result = formatDate(date);
        expect(result).toBe('Invalid date');
    });
});