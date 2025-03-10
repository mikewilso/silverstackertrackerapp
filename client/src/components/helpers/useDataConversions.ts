import moment from 'moment';
import { formData } from '../../types/types';

export const convertToOzt = (weight: number, type: string) => {
    if(type === 'grams') {
        //convert grams to ozt
        return weight / 31.104;
    }
    else if(type === 'oz') {
        //convert oz to ozt
        return weight / 1.09714;
    }
    else return weight;
}

export const convertToOz = (weight: number, type: string) => {
    if(type === 'grams') {
        //convert grams to oz
        return weight / 28.35;
    }
    else if(type === 'ozt') {
        //convert ozt to oz
        return weight * 1.09714;
    }
    else return weight;
}

export const convertToGrams = (weight: number, type: string) => {
    if(type === 'oz') {
        //convert oz to grams
        return weight * 28.35;
    }
    else if(type === 'ozt') {
        //convert ozt to grams
        return weight * 31.104;
    }
    else return weight;
}

export function formatDate(dateString: string): string {
    const date = moment(dateString, moment.ISO_8601);
    if (!date.isValid()) {
      return 'Invalid date';
    }
    return date.format('YYYY-MM-DD');
  }

export const handleAddDataFields = (formData: formData) => {
    let newFormData = formData;
    let purity = Number(newFormData.purity);
    let amount = newFormData.amount;
    // Convert the weight to all three types of weight with their pure weight
    newFormData.purchasedate = formatDate(newFormData.purchasedate);
    newFormData.ozweight = convertToOz(formData.unitweight, formData.weighttype);
    newFormData.oztweight = convertToOzt(formData.unitweight, formData.weighttype);
    newFormData.gramweight = convertToGrams(formData.unitweight, formData.weighttype);
    newFormData.ozweightpure = newFormData.ozweight * purity;
    newFormData.oztweightpure = newFormData.oztweight * purity;
    newFormData.gramweightpure = newFormData.gramweight * purity;
    newFormData.totalpureozweight = newFormData.ozweightpure * amount;
    newFormData.totalpureoztweight = newFormData.oztweightpure * amount;
    newFormData.totalpuregramweight = newFormData.gramweightpure * amount;

    return newFormData;
};