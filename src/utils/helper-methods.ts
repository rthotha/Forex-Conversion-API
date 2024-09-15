import { randomBytes } from "crypto";

export function getStartDateByWeek(number:any):string{

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - number*7);
    return startDate.toISOString().slice(0,10) ;
}


export function calculateAverageForex(observations:any[],series:string):number{

    let total = 0;
    let count = 0;

    for (const observation of observations){

        const rate = parseFloat(observation[series]['v']);
        total = total + rate;
        count++
   }

    return total / count;
}