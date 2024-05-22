import moment from 'moment';

export const convertToOzt = (weight: number, type: string) => {
    if(type === 'grams') {
        //convert grams to ozt
        return weight / 31.104;
    }
    else if(type === 'oz') {
        //convert oz to ozt
        return weight * 1.09714;
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

export const formatDate = (dateString: string) => {
    return moment(dateString).format(
        'YYYY-MM-DD',
    );
}