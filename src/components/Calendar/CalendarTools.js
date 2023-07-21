export const getNowDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    
    return year + '-' + month + '-' + day;
}


export function getYoil(able, day) {
    const selected = new Date(day);

    if (selected.getDay() == 0 && Math.floor(able / 1000000) == 1) { return 1; }
    else if (selected.getDay() == 1 && Math.floor(able / 100000) % 10 == 1) { return 1; }
    else if (selected.getDay() == 2 && Math.floor(able / 10000) % 10 == 1) { return 1; }
    else if (selected.getDay() == 3 && Math.floor(able / 1000) % 10 == 1) { return 1; }
    else if (selected.getDay() == 4 && Math.floor(able / 100) % 10 == 1) { return 1; }
    else if (selected.getDay() == 5 && Math.floor(able / 10) % 10 == 1) { return 1; }
    else if (selected.getDay() == 6 && Math.floor(able) % 10 == 1) { return 1; }
    else { return 0; }
}