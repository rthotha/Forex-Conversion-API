import {request} from '@playwright/test';

const baseUrl = 'https://www.bankofcanada.ca/valet';

export async function getForexData(seriesName:string, startDate:string, endDate:string){
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`+`/observations/${seriesName}/json?start_date=${startDate}&end_date=${endDate}`);
    return response;
}