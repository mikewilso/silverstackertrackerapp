import { 
    convertToOzt, 
    convertToOz, 
    convertToGrams, 
    formatDate, 
    handleAddDataFields } from './useDataConversions';

describe('convertToOzt', () => {
    it('should convert grams to ozt', () => {
        const result = convertToOzt(31.104, 'grams');
        expect(result).toBeCloseTo(1, 3);
    });

    it('should convert oz to ozt', () => {
        const result = convertToOzt(1, 'oz');
        expect(result).toBeCloseTo(0.911, 3);
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
        expect(result).toBeCloseTo(1.097, 3);
    });

    it('should return the same weight for other types', () => {
        const result = convertToOz(1, 'other');
        expect(result).toBe(1);
    });
});

describe('convertToGrams', () => {
    it('should convert oz to grams', () => {
        const result = convertToGrams(1, 'oz');
        expect(result).toBeCloseTo(28.35, 2);
    });

    it('should convert ozt to grams', () => {
        const result = convertToGrams(1, 'ozt');
        expect(result).toBeCloseTo(31.104, 3);
    });

    it('should return the same weight for other types', () => {
        const result = convertToGrams(1, 'other');
        expect(result).toBe(1);
    });
});

describe('formatDate', () => {
    it('should format date string to YYYY-MM-DD', () => {
        const date = '2022-01-01T00:00:00';
        const result = formatDate(date);
        expect(result).toBe('2022-01-01');
    });

    it('should return "Invalid date" for invalid date strings', () => {
        const date = 'invalid date';
        const result = formatDate(date);
        expect(result).toBe('Invalid date');
    });

    it('should return "Invalid date" for non-ISO date strings', () => {
        const date = '01-01-2022';
        const result = formatDate(date);
        expect(result).toBe('Invalid date');
    });
});

describe('handleAddDataFields', () => {
    it('should correctly convert weights and calculate pure weights', async () => {

    const mockFormData = {
        id: 1,
        name: 'test coin',
        description: 'test description',
        purchasedate: '2022-01-01T00:00:00',
        purchasedfrom: 'test seller',
        purchaseprice: 1,
        form: 'coin',
        mint: 'test mint',
        metaltype: 'gold',
        purity: 0.5,
        weighttype: 'oz',
        unitweight: 1,
        ozweight: 0,
        oztweight: 0,
        gramweight: 0,
        ozweightpure: 0,
        oztweightpure: 0,
        gramweightpure: 0,
        amount: 2,
        totalpureozweight: 0,
        totalpureoztweight: 0,
        totalpuregramweight: 0,
        imagefileid: 0,
    };

    const result = await handleAddDataFields(mockFormData);
        expect(result.purchasedate).toBe('2022-01-01');
        expect(result.ozweight).toBe(1);
        expect(result.oztweight).toBeCloseTo(0.911, 3);
        expect(result.gramweight).toBeCloseTo(28.35, 2);
        expect(result.ozweightpure).toBe(0.5);
        expect(result.oztweightpure).toBeCloseTo(0.456, 3);
        expect(result.gramweightpure).toBeCloseTo(14.175, 3);
        expect(result.totalpureozweight).toBe(1);
        expect(result.totalpureoztweight).toBeCloseTo(0.91, 2);
        expect(result.totalpuregramweight).toBeCloseTo(28.35, 2);
    });
  });